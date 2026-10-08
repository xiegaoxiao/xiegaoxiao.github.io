---
title: Java Spring项目实战 第一期(角色列表的显示和添加)
date: '2024-10-13T12:59:09.000Z'
updated: '2024-10-18T13:24:58.886Z'
permalink: 2024/10/13/2024/10/JavaSpringProject01/
categories:
  - 技术
tags:
  - Java
  - Spring
comments: false
abbrlink: '525111e7'
---

# 1\. Spring环境搭建

## 1.1 Spring环境搭建步骤

### 创建工程（Project&Module）

-   创建好后导入三个核心包
    
    ```xml
    <dependency>  
      <groupId>org.springframework</groupId>  
      <artifactId>spring-context</artifactId>  
      <version>5.0.5.RELEASE</version>  
    </dependency>  
    <dependency>  
      <groupId>org.springframework</groupId>  
      <artifactId>spring-web</artifactId>  
      <version>5.0.5.RELEASE</version>  
    </dependency>  
    <dependency>  
      <groupId>org.springframework</groupId>  
      <artifactId>spring-webmvc</artifactId>  
      <version>5.0.5.RELEASE</version>  
    </dependency>
    ```
    
-   在**resource**文件夹下创建`applicationContext.xml`和`spring-mvc.xml` 不要动![springp01.png](https://www.helloimg.com/i/2024/10/13/670b692a8cbcb.png)
    
-   在`webapp`下`WEB-INF`下的`web.xml`改成
    
    ```xml
    <?xml version="1.0" encoding="UTF-8"?>
    <web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee
                          http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
             version="4.0">
    
    </web-app>
    ```
    
-   在`web-app`下加入一下代码**都是固定写法**
    
    ```xml
    <!--乱码过滤器    -->  
    <filter>  
        <filter-name>CharacterEncodingFilter</filter-name>  
        <filter-class>org.springframework.web.filter.CharacterEncodingFilter</filter-class>  
        <init-param>        <param-name>encoding</param-name>  
            <param-value>UTF-8</param-value>  
        </init-param></filter>  
    <filter-mapping>  
        <filter-name>CharacterEncodingFilter</filter-name>  
        <url-pattern>/*</url-pattern>  
    </filter-mapping>  
      
    <!--配置核心控制器 -->  
    <servlet>  
        <servlet-name>DispatcherServlet</servlet-name>  
        <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>  
        <init-param>        <param-name>contextConfigLocation</param-name>  
            <param-value>classpath:spring-mvc.xml</param-value>  
        </init-param>    <load-on-startup>1</load-on-startup>  
    </servlet>  
    <servlet-mapping>  
        <servlet-name>DispatcherServlet</servlet-name>  
        <url-pattern>/</url-pattern>  
    </servlet-mapping>  
      
    <!--配置全局参数    -->  
    <context-param>  
        <param-name>contextConfigLocation</param-name>  
        <param-value>classpath:applicationContext.xml</param-value>  
    </context-param>  
    <!--配置监听器-->  
    <listener>  
        <listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>  
    </listener>
    ```
    

### 导入静态页面

-   导入后执行`OverWritte for all`  
    ![springp02.png](https://www.helloimg.com/i/2024/10/13/670b6c9c41d32.png)

### 创建数据库

-   导入sql文件并执行,刷新出现三张表就成功了  
    ![nivcat01.png](https://www.helloimg.com/i/2024/10/13/670b6f2bdd1af.png)

### 创建POJO

-   将资料里面的java文件放入到`domain`  
    ![importpojo01.png](https://www.helloimg.com/i/2024/10/13/670b70682f235.png)

### 创建配置文件

-   将资料中的`log4j.properties` 导入到`resource`目录中或者创建文件填入下面的代码
    
    ```properties
    ### direct log messages to stdout ###  
    log4j.appender.stdout=org.apache.log4j.ConsoleAppender  
    log4j.appender.stdout.Target=System.out  
    log4j.appender.stdout.layout=org.apache.log4j.PatternLayout  
    log4j.appender.stdout.layout.ConversionPattern=%d{ABSOLUTE} %5p %c{1}:%L - %m%n  
      
    ### direct messages to file mylog.log ###  
    log4j.appender.file=org.apache.log4j.FileAppender  
    log4j.appender.file.File=c:/mylog.log  
    log4j.appender.file.layout=org.apache.log4j.PatternLayout  
    log4j.appender.file.layout.ConversionPattern=%d{ABSOLUTE} %5p %c{1}:%L - %m%n  
      
    ### set log levels - for more verbose logging change 'info' to 'debug' ###  
      
    log4j.rootLogger=info, stdout
    ```
    
-   要使用这文件 要导入对应的坐标
    
    ```xml
    <dependency>  
      <groupId>org.slf4j</groupId>  
      <artifactId>slf4j-log4j12</artifactId>  
      <version>1.7.7</version>  
    </dependency>  
    <dependency>  
      <groupId>log4j</groupId>  
      <artifactId>log4j</artifactId>  
      <version>1.2.17</version>  
    </dependency>
    ```
    
-   我们要连接`mysql` 还需要导坐标
    
    ```xml
    <dependency>  
      <groupId>mysql</groupId>  
      <artifactId>mysql-connector-java</artifactId>  
      <version>8.0.32</version>  
    </dependency>  
    <dependency>  
      <groupId>com.mchange</groupId>  
      <artifactId>c3p0</artifactId>  
      <version>0.10.1</version>  
    </dependency>  
    <dependency>  
      <groupId>org.springframework</groupId>  
      <artifactId>spring-jdbc</artifactId>  
      <version>5.0.5.RELEASE</version>  
    </dependency>  
    <dependency>  
      <groupId>org.springframework</groupId>  
      <artifactId>spring-tx</artifactId>  
      <version>5.0.5.RELEASE</version>  
    </dependency>
    ```
    
-   在`resource`目录下创建`jdbc.properties`
    
    ```xml
    jdbc.driver = com.mysql.jdbc.Driver  
    jdbc.url = jdbc:mysql://localhost:3306/test  
    jdbc.username = root  
    jdbc.password = 123456
    ```
    

# 2\. 角色列表的展示和添加

## 2.1 角色列表展示的效果

![xiaoguo01.png](https://www.helloimg.com/i/2024/10/13/670bc3109aaa8.png)

## 2.2 角色列表展示的步骤

-   我们需要将实现类作为`Bean`加载到`applicationContext`中要进行配置
    
    ```xml
    <?xml version="1.0" encoding="UTF-8"?>  
    <beans xmlns="http://www.springframework.org/schema/beans"  
           xmlns:context="http://www.springframework.org/schema/context"  
           xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"  
           xsi:schemaLocation="  
           http://www.springframework.org/schema/beans       http://www.springframework.org/schema/beans/spring-beans.xsd       http://www.springframework.org/schema/context       http://www.springframework.org/schema/context/spring-context.xsd">  
        <!-- 加载第三方配置文件    -->  
        <context:property-placeholder location="classpath:jdbc.properties"/>  
        <!--配置数据源    -->  
        <bean id="dataSource" class="com.mchange.v2.c3p0.ComboPooledDataSource">  
            <property name="driverClass" value="${jdbc.driver}"/>  
            <property name="jdbcUrl" value="${jdbc.url}"/>  
            <property name="user" value="${jdbc.username}"/>  
            <property name="password" value="${jdbc.password}"/>  
        </bean>    <!--配置jdbcTemplate对象 用来操作数据库    -->  
        <bean id="jdbcTemplate" class="org.springframework.jdbc.core.JdbcTemplate">  
            <property name="dataSource" ref="dataSource"/>  
                </bean>  
    </beans>
    ```
    

### 数据访问层

-   创建RoleDao
    
    ```java
    public interface RoleDao {  
        public List<Role> findAll();  
    }
    ```
    
-   创建RoleDaoImpl
    
    ```java
    @Repository  
    public class RoleDaoImpl implements RoleDao {  
        @Autowired  
        private JdbcTemplate jdbcTemplate;  
        @Override  
        public List<Role> findAll() {  
            return jdbcTemplate.query("select * from sys_role", new BeanPropertyRowMapper<Role>(Role.class));  
        }  
      
    }
    ```
    

### 服务层

-   创建RoleService
    
    ```java
    public interface RoleService {  
        public List<Role> findAll();  
    }
    ```
    
-   创建RoleServiceImpl
    
    ```java
    @Service  
    public class RoleServiceImpl implements RoleService {  
        /**  
         * 返回所有Role对象  
         * @return  List<Role>  
         **/  
        @Autowired  
        private RoleDao roleDao;  
        @Override  
        public List<Role> findAll() {  
            return roleDao.findAll();  
        }  
     
    }
    ```
    

### 业务层

-   创建RoleController
    
    ```java
    @RequestMapping("/role")  
    @Controller  
    public class RoleController {  
        @Autowired  
        private RoleService roleService;  
      
        @RequestMapping("/list")  
        public ModelAndView list(){  
            ModelAndView modelAndView = new ModelAndView();  
            List<Role> roleList = roleService.findAll();  
            modelAndView.addObject("roleList",roleList);  
            modelAndView.setViewName("role-list");  
            System.out.println(roleList);  
            return modelAndView;  
        }  
    }
    ```
    

### 前端

-   导入`jstl`的`c`标签  
    `<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>`
-   在tbody中添加以下代码
    
    ```jsp
    <c:forEach items="${roleList}" var="role">  
        <tr>  
           <td><input name="ids" type="checkbox"></td>  
           <td>${role.id}</td>  
           <td>${role.roleName}</td>  
           <td>${role.roleDesc}</td>  
           <td class="text-center">  
              <a href="${pageContext.request.contextPath}/role/deleteOne?id=${role.id}" class="btn bg-olive btn-xs">删除</a>  
           </td>    
        </tr>
    </c:forEach>
    ```
    

# 效果展示

-   打开Tomcat 看到如下界面就成功了  
    ![xiaoguo02.png](https://www.helloimg.com/i/2024/10/13/670bc34949bc9.png)
