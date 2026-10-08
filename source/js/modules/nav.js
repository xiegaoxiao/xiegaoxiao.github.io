/* ============================================================================
 * modules/nav.js —— 导航栏 / 首屏欢迎语 / 随便逛逛 / 分享按钮
 * ----------------------------------------------------------------------------
 * 本文件由 source/js/fomal.js 拆出（2026-10-03 屎山重构）。
 * 【重要】这里故意不套 IIFE：主题 pug 模板里有大量内联 onclick="xxx()"，
 *        以及别的脚本会直接调全局函数，所以本文件里的声明必须留在全局作用域。
 * ----------------------------------------------------------------------------
 * 包含的模块（括号内为拆分前在 fomal.js 里的行号）：
 *   · 导航栏显示标题（37-66）—— 滚动到正文后，顶栏中间淡入文章标题（原来只有站点名）
 *   · 欢迎信息 —— 根据访客本地时间显示侧栏问候语；首次加载及 PJAX 换页时更新
 *   · 随便逛逛（504-525）—— 右下角"随便逛逛"按钮，随机跳一篇文章
 *   · 分享按钮（1237-1267）—— 文章页分享：复制链接 / 调起系统分享面板
 * ----------------------------------------------------------------------------
 * 和「顶栏 + 首屏 + 分享」有关的交互都在这。
 * 加载方式：_config.fomalhaut.yml 的 inject.bottom 列表里以 <script defer> 引用。
 * ----------------------------------------------------------------------------
 * 【本文件目录】共 8 个顶层声明（行号可能随后续编辑漂移，找不到就 Ctrl+F 搜函数名）
 *     37  tonav()
 *     55  scrollToTop()
 *         showWelcome()
 *    168  randomPost()
 *    191  share_()
 *    215  share()
 * ========================================================================== */

/* ------------------------------ 导航栏显示标题 ------------------------------ */
/* 原 fomal.js 37-66 行，原样搬运，未改逻辑 */
/* 导航栏显示标题 start */

document.addEventListener('pjax:complete', tonav);
document.addEventListener('DOMContentLoaded', tonav);
//响应pjax
function tonav() {
  // Replace only this module's listener; keep other scroll handlers intact.
  var $window = $(window);
  $window.off('scroll.fomalNavTitle');
  var nameContainer = document.getElementById("name-container");
  var menusItems = document.getElementsByClassName("menus_items")[1];
  var pageName = document.getElementById("page-name");
  if (!nameContainer || !menusItems || !pageName) return;

  nameContainer.setAttribute("style", "display:none");
  var position = $window.scrollTop();
  $window.on('scroll.fomalNavTitle', function () {
    var scroll = $window.scrollTop();
    if (scroll > position) {
      nameContainer.setAttribute("style", "");
      menusItems.setAttribute("style", "display:none!important");
    } else {
      menusItems.setAttribute("style", "");
      nameContainer.setAttribute("style", "display:none");
    }
    position = scroll;
  });
  //修复没有弄右键菜单的童鞋无法回顶部的问题
  pageName.innerText = document.title.split(" | ethan_xie")[0];
}

function scrollToTop() {
  document.getElementsByClassName("menus_items")[1].setAttribute("style", "");
  document.getElementById("name-container").setAttribute("style", "display:none");
  btf.scrollToDest(0, 500);
}

/* 导航栏显示标题 end */

/* ------------------------------ 欢迎信息 ------------------------------ */
/* 欢迎信息 start */
// 本地时间即可生成问候语，无需定位接口或 API Key。
function showWelcome() {
  const el = document.getElementById("welcome-info");
  if (!el) return;
  let timeChange;
  let date = new Date();
  let hour = date.getHours();
  if (hour >= 5 && hour < 11) timeChange = "<span>上午好</span>";
  else if (hour >= 11 && hour < 13) timeChange = "<span>中午好</span>";
  else if (hour >= 13 && hour < 18) timeChange = "<span>下午好</span>";
  else if (hour >= 18 && hour < 24) timeChange = "<span>晚上好</span>";
  else timeChange = "<span>夜深了</span>";
  let clock = String(hour).padStart(2, "0") + ":" + String(date.getMinutes()).padStart(2, "0");

  el.innerHTML = `<b><center>🎉 欢迎信息 🎉</center>${timeChange}，欢迎来到 ethan_xie 的博客！现在是 <span>${clock}</span>。这里记录我的开源项目与技术学习，欢迎随便逛逛。</b>`;
}
window.addEventListener('load', showWelcome);
document.addEventListener('DOMContentLoaded', showWelcome);
document.addEventListener('pjax:complete', showWelcome);
showWelcome();

/* 欢迎信息 end */

/* ------------------------------ 随便逛逛 ------------------------------ */
/* 原 fomal.js 504-525 行，原样搬运，未改逻辑 */
/* 随便逛逛 start */
// 随便逛逛
// sitemap 里的 <loc> 是绝对地址（域名由 _config.yml 的 url 决定），
// 直接跳转会导致本地预览 / 镜像域名下跳到生产站，所以统一转成同源相对路径。
function randomPost() {
  fetch('/baidusitemap.xml').then(res => res.text()).then(str => (new window.DOMParser()).parseFromString(str, "text/xml")).then(data => {
    const ls = [...data.querySelectorAll('url loc')].map(el => {
      try {
        const u = new URL(el.textContent.trim(), location.origin);
        return u.pathname + u.search + u.hash;
      } catch (e) { return null }
    }).filter(Boolean);
    if (!ls.length) return;
    // 发现有时会和当前页面重复，加一个判断
    let url = ls[Math.floor(Math.random() * ls.length)];
    for (let i = 0; i < 20 && url === decodeURI(location.pathname); i++) {
      url = ls[Math.floor(Math.random() * ls.length)];
    }
    location.href = url;
  })
}
/* 随便逛逛 end */

/* ------------------------------ 分享按钮 ------------------------------ */
/* 原 fomal.js 1237-1267 行，原样搬运，未改逻辑 */
/* 分享按钮 start */
// 分享本页
function share_() {
  let url = window.location.origin + window.location.pathname
  try {
    // 截取标题
    var title = document.title;
    var subTitle = title.endsWith("| ethan_xie") ? title.substring(0, title.length - '| ethan_xie'.length) : title;
    navigator.clipboard.writeText('ethan_xie的站内分享\n标题：' + subTitle + '\n链接：' + url + '\n欢迎来访！🍭🍭🍭');
    fomalNotify({
          title: "成功复制分享信息🎉",
          message: "您现在可以通过粘贴直接跟小伙伴分享了！",
          position: 'top-left',
          offset: 50,
          showClose: true,
          type: "success",
          duration: 5000
        })
  } catch (err) {
    console.error('复制失败！', err);
  }
  // new ClipboardJS(".share", { text: function () { return '标题：' + document.title + '\n链接：' + url } });
  // btf.snackbarShow("本页链接已复制到剪切板，快去分享吧~")
}

// 防抖
function share() {
  debounce(share_, 300);
}

/* 分享按钮 end */
