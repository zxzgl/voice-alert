移动端采用uniapp开发，选择原因是足够简单
后端采用golang开发
逻辑如下


zabbix关键报警通过webhook触发指定用户的状态
移动端会轮询监测状态是否正常，不正常的话会后台播放音乐，并触发手机震动，经过测试给予app后台运行及网络权限即可长久正常工作

如果有需要可以自行下载编译，或者我看到了给完善下

后端代码如下
```golang
package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
)

func main() {
	var usermap = make(map[string]string)
	r := gin.Default()
	r.GET("/", func(c *gin.Context) {
		c.Writer.Header().Add("Access-Control-Allow-Origin", "*")
		user := c.Query("id")
		fmt.Println(usermap)
		c.String(http.StatusOK, usermap[user])
	})

	r.GET("/set", func(c *gin.Context) {
		user := c.Query("id")
		status := c.Query("status")
		if user == "" || status == "" {
			c.String(http.StatusOK, "")
			return
		}

		usermap[user] = status
		fmt.Println(user, status)
		c.String(http.StatusOK, "修改成功")
	})

	// Run("里面不指定端口号默认为8080")
	r.Run(":9090")
}
```
