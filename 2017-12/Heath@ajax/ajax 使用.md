

## AJAX使用心得

### Ajax 简介
1. AJAX = Asynchronous JavaScript and XML（异步的 JavaScript 和 XML）。
2. AJAX 最大的优点是在不重新加载整个页面的情况下，可以与服务器交换数据并更新部分网页内容。

### 使用步骤
1. 创建 XMLHttpRequest 对象的语法：

    ```
    var xmlhttp;
    if(windown.XMLHttpRequest){
      xmlhttp=new XMLHttpRequest();
    }else{
      xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    ```

2. 向服务器发送请求:

    ```
    open(method,url,async):规定请求的类型、URL 以及是否异步处理请求。
      method：请求的类型；GET 或 POST
      url：文件在服务器上的位置
      async：true（异步）或 false（同步）

    send(string):将请求发送到服务器。
      string：仅用于 POST 请求
    ```

    ```
    GET 请求
    	xmlhttp.open("GET","1.php",true);
    	
    	可能得到的是缓存的结果。避免这种情况，请向 URL 添加一个唯一的 ID：
    	xmlhttp.open("GET","1.php?t=" + Math.random(),true);
    	
    	希望通过 GET 方法发送信息，请向 URL 添加信息：
    	xmlhttp.open("GET","1.php?fname=Henry&lname=Ford",true);
    ```

    ```
    POST 请求
    	xmlhttp.open("POST","1.php",true);
    	
    	如果需要像 HTML 表单那样 POST 数据，请使用 setRequestHeader() 来添加 HTTP 头。然后在 send() 方法中规定您希望发送的数据：
    		xmlhttp.open("POST","1.php",true);
    		xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    		xmlhttp.send("fname=Henry&lname=Ford");
    	
    setRequestHeader(header,value):向请求添加 HTTP 头。
        header: 规定头的名称
        value: 规定头的值
    ```

    ```
    GET 还是 POST？
        与 POST 相比，GET 更简单也更快，并且在大部分情况下都能用。

        然而，在以下情况中，请使用 POST 请求：
            无法使用缓存文件（更新服务器上的文件或数据库）
            向服务器发送大量数据（POST 没有数据量限制）
            发送包含未知字符的用户输入时，POST 比 GET 更稳定也更可靠
    ```

    ​

3. 服务器响应

    ```
    onreadystatechange 事件：

    	当请求被发送到服务器时，我们需要执行一些基于响应的任务。

    	每当 readyState 改变时，就会触发 onreadystatechange 事件。

    	存储函数（或函数名），每当 readyState 属性改变时，就会调用该函数。

    	当 readyState 等于 4 且状态为 200 时，表示响应已就绪：

    	onreadystatechange 事件被触发 5 次（0 - 4），对应着 readyState 的每个变化。

    ```

    ```
    xmlhttp.onreadystatechange=function(){
    	if (xmlhttp.readyState==4 && xmlhttp.status==200){
    	   console.log(xmlhttp.readyState, xmlhttp.status)
    	}
    }
    ```

    ​

    ```
    onreadystatechange 事件被触发 5 次（0 - 4），对应着 readyState 的每个变化。
    	0: 请求未初始化
    	1: 服务器连接已建立,但是还没有发送（还没有调用 send()）。
    	2: 请求已接收,正在处理中（通常现在可以从响应中获取内容头）。
    	3: 请求处理中,通常响应中已有部分数据可用了，但是服务器还没有完成响应的生成。
    	4: 请求已完成，且响应已就绪
    ```

    ```
    status：
        200: "OK"
        404: 未找到页面

        100——客户必须继续发出请求
        101——客户要求服务器根据请求转换HTTP协议版本
        200——交易成功
        201——提示知道新文件的URL
        202——接受和处理、但处理未完成
        203——返回信息不确定或不完整
        204——请求收到，但返回信息为空
        205——服务器完成了请求，用户代理必须复位当前已经浏览过的文件
        206——服务器已经完成了部分用户的GET请求
        300——请求的资源可在多处得到
        301——删除请求数据
        302——在其他地址发现了请求数据
        303——建议客户访问其他URL或访问方式
        304——客户端已经执行了GET，但文件未变化
        305——请求的资源必须从服务器指定的地址得到
        306——前一版本HTTP中使用的代码，现行版本中不再使用
        307——申明请求的资源临时性删除
        400——错误请求，如语法错误
        401——请求授权失败
        402——保留有效ChargeTo头响应
        403——请求不允许
        404——没有发现文件、查询或URl
        405——用户在Request-Line字段定义的方法不允许
        406——根据用户发送的Accept拖，请求资源不可访问
        407——类似401，用户必须首先在代理服务器上得到授权
        408——客户端没有在用户指定的时间内完成请求
        409——对当前资源状态，请求不能完成
        410——服务器上不再有此资源且无进一步的参考地址
        411——服务器拒绝用户定义的Content-Length属性请求
        412——一个或多个请求头字段在当前请求中错误
        413——请求的资源大于服务器允许的大小
        414——请求的资源URL长于服务器允许的长度
        415——请求资源不支持请求项目格式
        416——请求中包含Range请求头字段，在当前请求资源范围内没有range指示值，请求也不包含If-Range请求头字段
        417——服务器不满足请求Expect头字段指定的期望值，如果是代理服务器，可能是下一级服务器不能满足请求
        500——服务器产生内部错误
        501——服务器不支持请求的函数
        502——服务器暂时不可用，有时是为了防止发生系统过载
        503——服务器过载或暂停维修
        504——关口过载，服务器使用另一个关口或服务来响应用户，等待时间设定值较长
        505——服务器不支持或拒绝支请求头中指定的HTTP版本

    ```



### jQuery-Ajax

1. GET 方法

   ```
   $.get(URL,data,function(data,status,xhr),dataType)
       URL: 必需。规定您需要请求的 URL。
       data: 可选。规定连同请求发送到服务器的数据。
       callback: 可选。规定当请求成功时运行的函数
         data - 包含来自请求的结果数据
         status - 包含请求的状态
         xhr - 包含 XMLHttpRequest 对象
       dataType:可选。规定预期的服务器响应的数据类型。
   ```

   ​

2. POST 方法

   ```
   $.post(URL,data,callback,dataType);
       URL: 必需。规定您需要请求的 URL。
       data: 可选。规定连同请求发送到服务器的数据。
       callback: 可选。规定当请求成功时运行的函数
         data - 包含来自请求的结果数据
         status - 包含请求的状态
         xhr - 包含 XMLHttpRequest 对象
       dataType:可选。规定预期的服务器响应的数据类型。
   ```

3. AJAX 方法

   ```
   ajax() 方法用于执行 AJAX（异步 HTTP）请求。
   所有的 jQuery AJAX 方法都使用 ajax() 方法。该方法通常用于其他方法不能完成的请求。
   $.ajax({name:value, name:value, ... })

   属性：
   	async:布尔值，表示请求是否异步处理。默认是 true。
   	beforeSend(xhr):	发送请求前运行的函数。
   	cache:	布尔值，表示浏览器是否缓存被请求页面。默认是 true。
   	complete(xhr,status):	请求完成时运行的函数（在请求成功或失败之后均调用，即在 success 和 error 函数之后）。
   	contentType:	发送数据到服务器时所使用的内容类型。默认是："application/x-www-form-urlencoded"。
   	context:	为所有 AJAX 相关的回调函数规定 "this" 值。
   	data:	规定要发送到服务器的数据。
   	dataFilter(data,type):	用于处理 XMLHttpRequest 原始响应数据的函数。
   	dataType:	预期的服务器响应的数据类型。
   	error(xhr,status,error):	如果请求失败要运行的函数。
   	global:	布尔值，规定是否为请求触发全局 AJAX 事件处理程序。默认是 true。
   	ifModified:	布尔值，规定是否仅在最后一次请求以来响应发生改变时才请求成功。默认是 false。
   	jsonp:	在一个 jsonp 中重写回调函数的字符串。
   	jsonpCallback:	在一个 jsonp 中规定回调函数的名称。
   	password:	规定在 HTTP 访问认证请求中使用的密码。
   	processData:	布尔值，规定通过请求发送的数据是否转换为查询字符串。默认是 true。
   	scriptCharset:	规定请求的字符集。
   	success(result,status,xhr):	当请求成功时运行的函数。
   	timeout:	设置本地的请求超时时间（以毫秒计）。
   	traditional:	布尔值，规定是否使用参数序列化的传统样式。
   	type:	规定请求的类型（GET 或 POST）。
   	url:	规定发送请求的 URL。默认是当前页面。
   	username:	规定在 HTTP 访问认证请求中使用的用户名。
   	xhr:	用于创建 XMLHttpRequest 对象的函数。
   ```

4. Other

   ```
   $.ajax()	执行异步 AJAX 请求
   $.ajaxPrefilter()	在每个请求发送之前且被 $.ajax() 处理之前，处理自定义 Ajax 选项或修改已存在选项
   $.ajaxSetup()	为将来的 AJAX 请求设置默认值
   $.ajaxTransport()	创建处理 Ajax 数据实际传送的对象
   $.get()	使用 AJAX 的 HTTP GET 请求从服务器加载数据
   $.getJSON()	使用 HTTP GET 请求从服务器加载 JSON 编码的数据
   $.getScript()	使用 AJAX 的 HTTP GET 请求从服务器加载并执行 JavaScript
   $.param()	创建数组或对象的序列化表示形式（可用于 AJAX 请求的 URL 查询字符串）
   $.post()	使用 AJAX 的 HTTP POST 请求从服务器加载数据
   ajaxComplete()	规定 AJAX 请求完成时运行的函数
   ajaxError()	规定 AJAX 请求失败时运行的函数
   ajaxSend()	规定 AJAX 请求发送之前运行的函数
   ajaxStart()	规定第一个 AJAX 请求开始时运行的函数
   ajaxStop()	规定所有的 AJAX 请求完成时运行的函数
   ajaxSuccess()	规定 AJAX 请求成功完成时运行的函数
   load()	从服务器加载数据，并把返回的数据放置到指定的元素中
   serialize()	编码表单元素集为字符串以便提交
   serializeArray()	编码表单元素集为 names 和 values 的数组
   ```



### HTTP

```
Http 简介	
	HTTP协议是Hyper Text Transfer Protocol（超文本传输协议）的缩写,是用于从万维网（WWW:World Wide Web ）服务器传输超文本到本地浏览器的传送协议。。
	HTTP是一个基于TCP/IP通信协议来传递数据（HTML 文件, 图片文件, 查询结果等）。
```

```
HTTP 工作原理
	HTTP协议工作于客户端-服务端架构为上。浏览器作为HTTP客户端通过URL向HTTP服务端即WEB服务器发送所有请求。
	Web服务器有：Apache服务器，IIS服务器（Internet Information Services）等。
	Web服务器根据接收到的请求后，向客户端发送响应信息。
	HTTP默认端口号为80，但是你也可以改为8080或者其他端口。

```

```
HTTP三点注意事项：
    HTTP是无连接：无连接的含义是限制每次连接只处理一个请求。服务器处理完客户的请求，并收到客户的应答后，即断开连接。采用这种方式可以节省传输时间。
    HTTP是媒体独立的：这意味着，只要客户端和服务器知道如何处理的数据内容，任何类型的数据都可以通过HTTP发送。客户端以及服务器指定使用适合的MIME-type内容类型。
    HTTP是无状态：HTTP协议是无状态协议。无状态是指协议对于事务处理没有记忆能力。缺少状态意味着如果后续处理需要前面的信息，则它必须重传，这样可能导致每次连接传送的数据量增大。另一方面，在服务器不需要先前信息时它的应答就较快。
```

```
HTTP请求方法
	GET：请求指定的页面信息，并返回实体主体。
	HEAD：类似于get请求，只不过返回的响应中没有具体的内容，用于获取报头
	POST：	向指定资源提交数据进行处理请求（例如提交表单或者上传文件）。数据被包含在请求体中。POST请求可能会导致新的资源的建立和/或已有资源的修改。
	PUT：从客户端向服务器传送的数据取代指定的文档的内容。
	DELETE：请求服务器删除指定的页面。
	CONNECT：HTTP/1.1协议中预留给能够将连接改为管道方式的代理服务器。
	OPTIONS：允许客户端查看服务器的性能。
	TRACE：回显服务器收到的请求，主要用于测试或诊断。
```

```
HTTP 响应头信息：
	Allow	
	服务器支持哪些请求方法（如GET、POST等）。

	Content-Encoding	
	文档的编码（Encode）方法。只有在解码之后才可以得到Content-Type头指定的内容类型。利用gzip压缩文档能够显著地减少HTML文档的下载时间。Java的GZIPOutputStream可以很方便地进行gzip压缩，但只有Unix上的Netscape和Windows上的IE 4、IE 5才支持它。因此，Servlet应该通过查看Accept-Encoding头（即request.getHeader("Accept-Encoding")）检查浏览器是否支持gzip，为支持gzip的浏览器返回经gzip压缩的HTML页面，为其他浏览器返回普通页面。

	Content-Length	
	表示内容长度。只有当浏览器使用持久HTTP连接时才需要这个数据。如果你想要利用持久连接的优势，可以把输出文档写入 ByteArrayOutputStream，完成后查看其大小，然后把该值放入Content-Length头，最后通过byteArrayStream.writeTo(response.getOutputStream()发送内容。

	Content-Type	
	表示后面的文档属于什么MIME类型。Servlet默认为text/plain，但通常需要显式地指定为text/html。由于经常要设置Content-Type，因此HttpServletResponse提供了一个专用的方法setContentType。

	Date	
	当前的GMT时间。你可以用setDateHeader来设置这个头以避免转换时间格式的麻烦。

	Expires	
	应该在什么时候认为文档已经过期，从而不再缓存它？

	Last-Modified	
	文档的最后改动时间。客户可以通过If-Modified-Since请求头提供一个日期，该请求将被视为一个条件GET，只有改动时间迟于指定时间的文档才会返回，否则返回一个304（Not Modified）状态。Last-Modified也可用setDateHeader方法来设置。

	Location	
	表示客户应当到哪里去提取文档。Location通常不是直接设置的，而是通过HttpServletResponse的sendRedirect方法，该方法同时设置状态代码为302。

	Refresh	
	表示浏览器应该在多少时间之后刷新文档，以秒计。除了刷新当前文档之外，你还可以通过setHeader("Refresh", "5; URL=http://host/path")让浏览器读取指定的页面。 
	注意这种功能通常是通过设置HTML页面HEAD区的＜META HTTP-EQUIV="Refresh" CONTENT="5;URL=http://host/path"＞实现，这是因为，自动刷新或重定向对于那些不能使用CGI或Servlet的HTML编写者十分重要。但是，对于Servlet来说，直接设置Refresh头更加方便。 

	注意Refresh的意义是"N秒之后刷新本页面或访问指定页面"，而不是"每隔N秒刷新本页面或访问指定页面"。因此，连续刷新要求每次都发送一个Refresh头，而发送204状态代码则可以阻止浏览器继续刷新，不管是使用Refresh头还是＜META HTTP-EQUIV="Refresh" ...＞。 

	注意Refresh头不属于HTTP 1.1正式规范的一部分，而是一个扩展，但Netscape和IE都支持它。

	Server	
	服务器名字。Servlet一般不设置这个值，而是由Web服务器自己设置。

	Set-Cookie	
	设置和页面关联的Cookie。Servlet不应使用response.setHeader("Set-Cookie", ...)，而是应使用HttpServletResponse提供的专用方法addCookie。参见下文有关Cookie设置的讨论。

	WWW-Authenticate	
	客户应该在Authorization头中提供什么类型的授权信息？在包含401（Unauthorized）状态行的应答中这个头是必需的。例如，response.setHeader("WWW-Authenticate", "BASIC realm=＼"executives＼"")。 
	注意Servlet一般不进行这方面的处理，而是让Web服务器的专门机制来控制受密码保护页面的访问（例如.htaccess）。
```

