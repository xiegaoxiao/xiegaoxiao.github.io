var posts=["2024/10/06/2024/10/JavaSSM02/","2024/10/09/2024/10/JavaSSM04/","2024/10/10/2024/10/JavaSSM05/","2024/10/06/2024/10/JavaSSM01/","2024/10/08/2024/10/JavaSSM03/","2024/10/11/2024/10/JavaSSM06/","2024/10/13/2024/10/JavaSpringProject01/","2024/10/12/2024/10/JavaTool/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };