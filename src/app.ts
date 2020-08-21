import configs from "./configs";
import Koa, { Context, Next } from "koa";
import KoaRouter from "koa-router";
import KoaBody from "koa-body"
import { bootstrapControllers } from "koa-ts-controllers";
import path from "path";
import Boom from "@hapi/boom"
import { Sequelize } from "sequelize-typescript";
import jwt from "jsonwebtoken";

const app = new Koa();
const router = new KoaRouter();

(async () => {

    const db = new Sequelize({
        ...configs.database,
        models: [__dirname + '/models/**/*']
    });

    // 声明一个类型判断
    interface UserInfo {
        id: number;
        name: string;
    }

    // 统一解密 前端发请求携带过来的 token
    app.use( async ( ctx: Context, next: Next ) => {
        let token = ctx.headers["authorization"];
        if (token) {
            // 统一存放到上下文中的 userInfo，但是没有提示，所以需要去types
            // 目录下面去声明
            ctx.userInfo = jwt.verify(token, configs.jwt.privateKey) as UserInfo;
        };
        await next();
    } )

    // 路由装饰器
    await bootstrapControllers(app, {
        // 绑定路由
        router,
        // 设置基础路径
        basePath: "/api",
        // 设置版本号，紧跟在基础路径后面 /api/v1
        versions: [1],
        // 映射路由控制器存放的目录
        controllers: [
            path.resolve(__dirname, './controllers/**/*')
        ],
        // 统一处理错误的接口 err错误的信息， ctx上下文对象
        errorHandler: async (err: any, ctx: Context) => {
            console.log(err);
            let status = 500;
            let body: any = {
                statusCode: status,
                error: "Internal Server error",
                message: "An internal server error occurred"
            }
            // 上面错误码统一定义为500其实是不合理的因为500是服务器错误，有时候并不是服务器的错误而是前端传递过程中的某些字段或者验证失败，那么这个时候应该返回的就是验证失败或者其他对应的验证码了所以需要进行下面的判断
            // 如果 err 存在 output就证明是字段或者其他验证失败了，可以返回 err对应错误去情况的 status状态码
            if (err.output) {
                // 错误状态码
                status = err.output.statusCode
                // 错误状态的提示信息
                body = { ...err.output.payload }
                // 如果存在 data就证明是某一些信息传递出错或者类型不对，都会放在这个data中想当于一个错误的信息收集
                if (err.data) {
                    body.errorDetails = err.data;
                }
            }
            // 如果没有 output 就代表是其他问题 比如： Cannot read property 'b' of undefined之类的就代表是的服务器错误了就可以默认返回 500了

            ctx.status = status;
            ctx.body = body;
        }
    });

    router.all('/', async ctx => {
        throw Boom.notFound('路由错误');
    });

    app.use(KoaBody());
    app.use(router.routes());

    app.listen(configs.server.port, configs.server.host, () => {
        console.log(`访问启动成功： http://${configs.server.host}:${configs.server.port}`);
    });
})()
