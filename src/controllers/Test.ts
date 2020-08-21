import {
    Controller, 
    Get, 
    Params,
    Query,
    Post,
    Body,
    Header,
    Ctx,
    Flow
} from "koa-ts-controllers";
import { IsNumberString, IsNotEmpty } from "class-validator"
// 一个专门处理 错误的 http 状态相应格式的一个功能库
import Boom from "@hapi/boom"
import { Context } from "koa";
// 中间件
import authorization from "../middlewares/authorization"

// 通过 class-validator 来进行 query的类型验证，告别传统判断处理
class GetUserQuery{
    @IsNumberString({}, {
        message: 'page必须是数字字符串'
    })
    page: number;
}

class PostUserBody{
    @IsNotEmpty({
        message: "用户名不能为空"
    })
    name: string;

    @IsNotEmpty({
        message: "密码不能为空"
    })
    password: string;
}


// 声明一个路由控制器，当前所有的地址都要基于 /test 目录下 
//  比如第一个是 /api/v1/test/hello  之所以要加 /api/v1 是因为规范而且在app.ts中也设置了
@Controller("/test")
class TestController{

    // 请求装饰器，并且设定路由地址
    @Get('/hello')
    async hello(){
        return 'Hello Test!';
    }

    // 对 params参数可以进行类型验证，验证的规则用正则
    @Get("/user/:id(\\d+)")
    async getUser(
        // @Params() params: {id: number}
        // 如果觉得上面的太麻烦 可以给装饰器里面传递参数，参数就是你想要获取的数据。然后还可以进行类型的校验
        @Params("id") id: number
    ){
        return `当前的paramsID是:${id}`
    }


    // 对 query 进行数据类型验证，因为前端传过来的可能是数字字符串也有可能是别的，如果通过传统的验证判断比较麻烦可以通过  class-validator 可以很方便的进行验证
    @Get("/users")
    async getUsers(
        // GetUserQuery  query的封装验证类 验证前端传进来是不是一个数字
        @Query() query: GetUserQuery
    ){
        if(true){
            // 每个方法返回不同的状态码代表不同的类型，notFound 代表404，资源不存在路由不存在或者注册失败等
            throw Boom.notFound("注册失败", "用户名已经存在")
        }
        return "当前的query" + JSON.stringify(query)
    }

    // @Get('/user')
    // async getUserQuery(
    //     @Query("id") id: number
    // ){
    //     return `当前的query参数id是:${id}`
    // }

    @Post("/userPost")
    async getUserBody(
        // 用于获取用户 body主体信息装饰器，而不是URL地址信息，比如表单
        @Body() body: {
            name: string,
            password: string
        },
        // 获取请求头的装饰器
        @Header() head: any
    ){
        console.log(head);
        return `当前的用户信息是:${JSON.stringify(body)}`;
    }

    @Post("/createUser")
    async createUser(
        @Body() body: PostUserBody
    ){
        return body;
    }

    @Get("/auth")
    // 调用中间件
    @Flow([authorization])
    async auth(
        @Ctx() ctx: Context
    ){
        return "不登录不能看" 
    }

    @Get("/noAuth")
    async noAuth(){
        return "随便看"
    }
}