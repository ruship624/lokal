/************IMPORTANT************/

Even though this is an HTML template, you will first need to setup a server to browse these files.
It is because of the USE of LESS CSS.
If you want to browse the website without server, replace the main.css file with main-static.css file as follows.
1) Rename main.css to 'main-less.css'
2) Rename main-static.css to 'main.css'
3) On (all) the HTML pages, change
    <!-- remove '/less' if you are using main-static.css file --> <!-- change rel to rel="stylesheet/less" if you are using main-less.css file --> <link rel="stylesheet" href="css/main.css">
    TO
    <link rel="stylesheet" href="css/main.css">