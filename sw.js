/**
 * 自动引入模板，在原有 sw-precache 插件默认模板基础上做的二次开发
 *
 * 因为是自定导入的模板，项目一旦生成，不支持随 sw-precache 的版本自动升级。
 * 可以到 Lavas 官网下载 basic 模板内获取最新模板进行替换
 *
 */

/* eslint-disable */

'use strict';

var precacheConfig = [["/404.html","e3f005761eedc542704d38adffe1e831"],["/about/index.html","4e91dd64a251c659b5f5c23491340844"],["/archives/2024/10/index.html","91a361cf8c07829a7baf55b33fa642ae"],["/archives/2024/index.html","dc50484db6fc8138c03781851c4d4b25"],["/archives/index.html","1e8f4205abef9dc25d816dc518a59c85"],["/assets/banner/element-plus.png","cfc1ab79347c25315d52aa56e4a0dc38"],["/assets/banner/friends.jpg","9b1558df9e886cb05b036a5f34d02606"],["/assets/banner/frontend.jpg","e529af07260c26c44722ccb8ee96637e"],["/assets/banner/git.jpg","b92926b27a287e0cf7476a62b9bdd83e"],["/assets/banner/gitea.jpg","75e210c3fa489f944ca379753385497e"],["/assets/banner/notes.jpg","1a9b1e65562aa410e21a867cc8eafaed"],["/assets/banner/oracle.jpg","a21d9da1a56e1b1b4d125a8b76e5a879"],["/assets/banner/spring-boot.jpg","a391668ca4cf7494db8461363088e8eb"],["/assets/banner/stellar.jpg","0d186e7c0306fbb1b26c5b6ac96ed7db"],["/assets/banner/tailwindcss.jpg","b5f26b8e0494de8cd9ccb1246e5f2788"],["/assets/icons/C.svg","7c34adbf587d216c8a53e88f0c5fd89a"],["/assets/icons/CPlusplus.svg","17b328833e425ec918722108fea7898b"],["/assets/icons/Comment.svg","9ff3f029c9b072bf355438fb946a8f43"],["/assets/icons/Css.svg","461c614def657dfa3888f416489fd3ed"],["/assets/icons/Docker.svg","0ea27239cc195b3df4a47d0457ba9631"],["/assets/icons/Git.svg","087a5f887c4983efb6151b4703571ea7"],["/assets/icons/Gitee.svg","ddbecba033b2b6d7c8af7a41fa8b2365"],["/assets/icons/Github.svg","f31a4810a6cad4ce4057d110bdf1eec1"],["/assets/icons/Gitlab.svg","8c07601b376e94e37adfc5e3469c6a94"],["/assets/icons/Go.svg","abcbab9a90611dce3b9cae6536d97613"],["/assets/icons/Html.svg","cc830495525b6390c3ca5ea75d373740"],["/assets/icons/Java.svg","b33084bf032ba82dd098af02bcaabe16"],["/assets/icons/Js.svg","ee0ff2eb3099d1c61ab2e8ebd9045145"],["/assets/icons/Kubernetes.svg","70372002f7d6e5d939e5e2cd39ac121c"],["/assets/icons/Nginx.svg","68851e9cc39498ee1c858a3181843275"],["/assets/icons/Php.svg","bc87170476f985530baafc35ee6eac2b"],["/assets/icons/Python.svg","8f6e90c101bd184135a060ccfc306532"],["/assets/icons/React.svg","e4c26abad2bafdc967bf07a635a8dd81"],["/assets/icons/Rss.svg","d7a6efc4655887735362c479250524b3"],["/assets/icons/Station.svg","f1fd126f51c33201ff78309bde8679ff"],["/assets/icons/Ts.svg","8842f60b8382127435dfd4c4be0f9045"],["/assets/icons/Vitejs.svg","a475b899f8b0385bb41a586cc759dbb4"],["/assets/icons/Vscode.svg","c596a40cfec34061255746c2d77cd5c7"],["/assets/icons/Vue.svg","db19af3a35323fe70a386ad90e00b2c1"],["/assets/icons/Wormhole.svg","e370d77989c438394e99ff51bedfa869"],["/assets/icons/tailwindcss.svg","6de5d35031d37947ae1f98e27b52caf1"],["/assets/images/algorithm.jpg","7d063ceb586400a5debc96cb58f5d855"],["/assets/images/avatar.jpg","62e8800ca2b9d21ac558c31aa0a59100"],["/assets/images/avatar1.jpg","69d880ab0e5cafcbf731d805d5bc8cc1"],["/assets/images/backend.jpg","0fb679681678fc30255e16ee331ef82f"],["/assets/images/bugfix.jpg","8adb955976386e9652be3f9e853e98b7"],["/assets/images/chart.jpg","0b91da85c37dc83ab37a90b655723a92"],["/assets/images/js.jpg","e140c71e445afb6ef513244f27d9b4a7"],["/assets/images/keyboard.jpg","7108f2a80285d6f15596ce5d931baf08"],["/assets/images/life.jpg","f379e559e8978b7adce608a17867bc09"],["/assets/images/linux.jpg","2e31df6876a8b189f5f85567e62efa13"],["/assets/images/mac.jpg","34b0b6f184dc6cd97d8d2f54671a0200"],["/assets/images/miniprogram.jpg","704e48ac92bf7e68c66ec7cc5299dc43"],["/assets/images/netease.svg","4af17741fdac8206853a2a9a00d5f956"],["/assets/images/nuxt3.jpg","1c0e7b5c1859f55bcc02d3d39e0488b2"],["/assets/images/operation.jpg","dbe81ab59cc7669f5761c3a3f19f7c50"],["/assets/images/pinia.jpg","2f37f0a9b1ce27b4af66f92f3632258c"],["/assets/images/ts.jpg","d55a59b7e82fcf04e28201429a016acc"],["/assets/images/wepay.jpg","96a031d3a8f0418f94e5b1e3b151c20c"],["/assets/wiki/ggzx/icon.svg","895403d826296dddf5eb3a1b463ea893"],["/assets/wiki/niuke/icon.svg","599e3c9e6713e37f84c2e8314f49f736"],["/categories/index.html","022376133a718a403f5aa01ab0f857c6"],["/categories/技术/index.html","b115eadee3afe84e6547fb7ca128c3d7"],["/categories/更新日志/index.html","8b23fadeadf9f52fc258315c2368255d"],["/categories/测试/index.html","b7da0b8b2148dca867494cc9ab21bc19"],["/css/code-block.css","da089dc26a34976f09731c0bc2cf92cf"],["/css/custom.css","0d456901a3f88df69c076967ea7c6ade"],["/css/main.css","4ab9582047acbd7763c68c64174526a5"],["/explore/notes/探索者笔记.html","48c560791f9f674ae60f008271b05742"],["/explore/sites/工具库.html","166d397f5f5f33a5bbf6b0f08467d792"],["/index.html","31b22c956635998ed8218366035ee243"],["/js/code-block.js","e124ff08a5c0c20792afc370cf853b16"],["/js/custom.js","d41d8cd98f00b204e9800998ecf8427e"],["/js/main.js","5018e50ec90e480975c6bfb8ca24f8a5"],["/js/plugins/copycode.js","ab0e450780d5873637ad4d9ff0df63db"],["/js/search/algolia-search.js","afc1c6d8615cd353a3885c1b8d121d57"],["/js/search/local-search.js","ea52407080bf359b9ff6ae4475c275dc"],["/js/services/fcircle.js","a6d050803bac61db70e3e8b4690f4859"],["/js/services/friends.js","2eacc2b7d0f9ed2c7c6932597b818cc8"],["/js/services/ghinfo.js","8287428a2b5ae937ecc999e7d7a96134"],["/js/services/mdrender.js","e20405085c6e2d05a3e7592e8141b15a"],["/js/services/memos.js","8b3ae879ab489ff3251b4f84b74ffd72"],["/js/services/siteinfo.js","4ea50ea959a391da1aebbedf3d806551"],["/js/services/sites.js","e332580fd438da0059712da3a70473b6"],["/js/services/timeline.js","8a96604ca8956476f58d2a90edfd59c9"],["/js/services/twikoo_new.js","807554c159aaa5b13b05b1b59518066e"],["/js/services/weibo.js","4f30e6b22981e09f0746183c91170450"],["/notebooks/index.html","493140380c7b8ced9cf9d36bb57c50df"],["/posts/1.html","7581cdd159b10f1c12265854ee18a673"],["/posts/JavaSSM01.html","26ace2d89bd85540fb2b3103c3607326"],["/posts/deploymentInit.html","ce08febbf458fa14137148a90bb66f91"],["/posts/problemsolve1.html","77cbe8fb55b39a8083b77c69fc9c4521"],["/posts/problemsolve2.html","e1062e178dcfa759cb966122de6a2006"],["/posts/测试文章1.html","87739001b15e879b7d664c20d54f75b4"],["/static/js/snow.js","e5269f3a2decb14b188f91ca9f0141b1"],["/sw-register.js","7766e22a00300cc9bc286c7db4e6009c"],["/tags/Java/index.html","9eb3b50b760fc298ff727bd78459a7b6"],["/tags/index.html","b391757f3bf1ad6d1571bfd9dda675b6"],["/tags/test/index.html","25bbd10ee86cd7a31542a63b17262cd5"],["/tags/技术/index.html","34bca7af2160dc0c4da086873a880c26"],["/tags/问题/index.html","33051a56c03548c24d50a6cb94767884"],["/wiki/index.html","664ca1342e5474b02ce1f784226dc227"],["/wiki/niuke/牛客零基础入门前端.html","cb6799c46ac6e84f956a65f24ff73784"],["/wiki/tags/刷题/index.html","9fc218ced2eeb14360e451466c0126ad"]];
var cacheName = 'sw-precache-v3--' + (self.registration ? self.registration.scope : '');
var firstRegister = 1; // 默认1是首次安装SW， 0是SW更新


var ignoreUrlParametersMatching = [/^utm_/];


var addDirectoryIndex = function (originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
        url.pathname += index;
    }
    return url.toString();
};

var cleanResponse = function (originalResponse) {
    // 如果没有重定向响应，不需干啥
    if (!originalResponse.redirected) {
        return Promise.resolve(originalResponse);
    }

    // Firefox 50 及以下不知处 Response.body 流, 所以我们需要读取整个body以blob形式返回。
    var bodyPromise = 'body' in originalResponse ?
        Promise.resolve(originalResponse.body) :
        originalResponse.blob();

    return bodyPromise.then(function (body) {
        // new Response() 可同时支持 stream or Blob.
        return new Response(body, {
            headers: originalResponse.headers,
            status: originalResponse.status,
            statusText: originalResponse.statusText
        });
    });
};

var createCacheKey = function (originalUrl, paramName, paramValue,
    dontCacheBustUrlsMatching) {

    // 创建一个新的URL对象，避免影响原始URL
    var url = new URL(originalUrl);

    // 如果 dontCacheBustUrlsMatching 值没有设置，或是没有匹配到，将值拼接到url.serach后
    if (!dontCacheBustUrlsMatching ||
        !(url.pathname.match(dontCacheBustUrlsMatching))) {
        url.search += (url.search ? '&' : '') +
            encodeURIComponent(paramName) + '=' + encodeURIComponent(paramValue);
    }

    return url.toString();
};

var isPathWhitelisted = function (whitelist, absoluteUrlString) {
    // 如果 whitelist 是空数组，则认为全部都在白名单内
    if (whitelist.length === 0) {
        return true;
    }

    // 否则逐个匹配正则匹配并返回
    var path = (new URL(absoluteUrlString)).pathname;
    return whitelist.some(function (whitelistedPathRegex) {
        return path.match(whitelistedPathRegex);
    });
};

var stripIgnoredUrlParameters = function (originalUrl,
    ignoreUrlParametersMatching) {
    var url = new URL(originalUrl);
    // 移除 hash; 查看 https://github.com/GoogleChrome/sw-precache/issues/290
    url.hash = '';

    url.search = url.search.slice(1) // 是否包含 '?'
        .split('&') // 分割成数组 'key=value' 的形式
        .map(function (kv) {
            return kv.split('='); // 分割每个 'key=value' 字符串成 [key, value] 形式
        })
        .filter(function (kv) {
            return ignoreUrlParametersMatching.every(function (ignoredRegex) {
                return !ignoredRegex.test(kv[0]); // 如果 key 没有匹配到任何忽略参数正则，就 Return true
            });
        })
        .map(function (kv) {
            return kv.join('='); // 重新把 [key, value] 格式转换为 'key=value' 字符串
        })
        .join('&'); // 将所有参数 'key=value' 以 '&' 拼接

    return url.toString();
};


var addDirectoryIndex = function (originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
        url.pathname += index;
    }
    return url.toString();
};

var hashParamName = '_sw-precache';
var urlsToCacheKeys = new Map(
    precacheConfig.map(function (item) {
        var relativeUrl = item[0];
        var hash = item[1];
        var absoluteUrl = new URL(relativeUrl, self.location);
        var cacheKey = createCacheKey(absoluteUrl, hashParamName, hash, false);
        return [absoluteUrl.toString(), cacheKey];
    })
);

function setOfCachedUrls(cache) {
    return cache.keys().then(function (requests) {
        // 如果原cacheName中没有缓存任何收，就默认是首次安装，否则认为是SW更新
        if (requests && requests.length > 0) {
            firstRegister = 0; // SW更新
        }
        return requests.map(function (request) {
            return request.url;
        });
    }).then(function (urls) {
        return new Set(urls);
    });
}

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(cacheName).then(function (cache) {
            return setOfCachedUrls(cache).then(function (cachedUrls) {
                return Promise.all(
                    Array.from(urlsToCacheKeys.values()).map(function (cacheKey) {
                        // 如果缓存中没有匹配到cacheKey，添加进去
                        if (!cachedUrls.has(cacheKey)) {
                            var request = new Request(cacheKey, { credentials: 'same-origin' });
                            return fetch(request).then(function (response) {
                                // 只要返回200才能继续，否则直接抛错
                                if (!response.ok) {
                                    throw new Error('Request for ' + cacheKey + ' returned a ' +
                                        'response with status ' + response.status);
                                }

                                return cleanResponse(response).then(function (responseToCache) {
                                    return cache.put(cacheKey, responseToCache);
                                });
                            });
                        }
                    })
                );
            });
        })
            .then(function () {
            
            // 强制 SW 状态 installing -> activate
            return self.skipWaiting();
            
        })
    );
});

self.addEventListener('activate', function (event) {
    var setOfExpectedUrls = new Set(urlsToCacheKeys.values());

    event.waitUntil(
        caches.open(cacheName).then(function (cache) {
            return cache.keys().then(function (existingRequests) {
                return Promise.all(
                    existingRequests.map(function (existingRequest) {
                        // 删除原缓存中相同键值内容
                        if (!setOfExpectedUrls.has(existingRequest.url)) {
                            return cache.delete(existingRequest);
                        }
                    })
                );
            });
        }).then(function () {
            
            return self.clients.claim();
            
        }).then(function () {
                // 如果是首次安装 SW 时, 不发送更新消息（是否是首次安装，通过指定cacheName 中是否有缓存信息判断）
                // 如果不是首次安装，则是内容有更新，需要通知页面重载更新
                if (!firstRegister) {
                    return self.clients.matchAll()
                        .then(function (clients) {
                            if (clients && clients.length) {
                                clients.forEach(function (client) {
                                    client.postMessage('sw.update');
                                })
                            }
                        })
                }
            })
    );
});



    self.addEventListener('fetch', function (event) {
        if (event.request.method === 'GET') {

            // 是否应该 event.respondWith()，需要我们逐步的判断
            // 而且也方便了后期做特殊的特殊
            var shouldRespond;


            // 首先去除已配置的忽略参数及hash
            // 查看缓存简直中是否包含该请求，包含就将shouldRespond 设为true
            var url = stripIgnoredUrlParameters(event.request.url, ignoreUrlParametersMatching);
            shouldRespond = urlsToCacheKeys.has(url);

            // 如果 shouldRespond 是 false, 我们在url后默认增加 'index.html'
            // (或者是你在配置文件中自行配置的 directoryIndex 参数值)，继续查找缓存列表
            var directoryIndex = 'index.html';
            if (!shouldRespond && directoryIndex) {
                url = addDirectoryIndex(url, directoryIndex);
                shouldRespond = urlsToCacheKeys.has(url);
            }

            // 如果 shouldRespond 仍是 false，检查是否是navigation
            // request， 如果是的话，判断是否能与 navigateFallbackWhitelist 正则列表匹配
            var navigateFallback = '';
            if (!shouldRespond &&
                navigateFallback &&
                (event.request.mode === 'navigate') &&
                isPathWhitelisted([], event.request.url)
            ) {
                url = new URL(navigateFallback, self.location).toString();
                shouldRespond = urlsToCacheKeys.has(url);
            }

            // 如果 shouldRespond 被置为 true
            // 则 event.respondWith()匹配缓存返回结果，匹配不成就直接请求.
            if (shouldRespond) {
                event.respondWith(
                    caches.open(cacheName).then(function (cache) {
                        return cache.match(urlsToCacheKeys.get(url)).then(function (response) {
                            if (response) {
                                return response;
                            }
                            throw Error('The cached response that was expected is missing.');
                        });
                    }).catch(function (e) {
                        // 如果捕获到异常错误，直接返回 fetch() 请求资源
                        console.warn('Couldn\'t serve response for "%s" from cache: %O', event.request.url, e);
                        return fetch(event.request);
                    })
                );
            }
        }
    });









/* eslint-enable */
