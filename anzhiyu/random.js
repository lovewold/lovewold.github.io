var posts=["2023/10/31/Hello-我是lovewold少个r/","2023/10/31/hello-world/","2023/10/31/leetcode刷题日记做菜顺序/"];function toRandomPost(){pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);};