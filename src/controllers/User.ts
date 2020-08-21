import { 
    Controller,
    Post,
    Body,
    Ctx
} from "koa-ts-controllers";
// 错误的 http 提示库
import Boom from "@hapi/boom";
// 封装验证类
import { VerifyUserRegister, VerifyUserLogin } from "../validators/User";
// 导入模型对象映射表
import { UserModel } from "../models/UserModel";
// 导入上下文对象
import { Context } from "koa";
// Node 内置的密码加密
import crypto from "crypto";
// jsonwebtoken
import jwt from "jsonwebtoken";
// 导入配置中的加密 jwt 凭证
import config from "../configs";

@Controller("/user")
export class UserControllers{
    /**
     * 用户注册
     */
    @Post("/register")
    async register(
        @Ctx() ctx: Context,
        @Body() body: VerifyUserRegister
    ){
        let { name, password } = body

        // 验证数据库中是否存在该用户信息
        let user = await UserModel.findOne({
            where: {
                name
            }
        });

        // 如果 user存在证明已经存在用户，不能注册
        if (user) {
            throw Boom.conflict("注册用户失败", "用户名已经被注册了")
        }

        // 否则实例化一个模型对象，用户控制数据表中的数据
        // (操作表，比如查询或者删除之类的直接通过模型类的静态方法就好，如果是操作表中的数据就要实例化模型对象) 
        let newUser = new UserModel();
        newUser.name = name;
        newUser.password = password;

        // 同步写入数据库
        await newUser.save();

        // 返回状态码
        ctx.status = 201;
        // 返回状态信息
        return {
            id: newUser.id,
            name: newUser.name,
            createdAt: newUser.createdAt
        };
    }

    /**
     * 用户登录
     */
    @Post("/login")
    async UserLogin(
        @Body() body: VerifyUserLogin,
        @Ctx() ctx: Context
    ){

        let { name, password } = body;

        let user = await UserModel.findOne({
            where: {
                name
            }
        });

        if (!user) {
            throw Boom.preconditionFailed("登录失败", "用户不存在");
        }

        // 将用户输入的密码进行加密从而和数据库中的进行比对
        password = crypto.createHash('md5').update(password).digest('hex');
        // 如果当前用户传入的密码和匹配出来的密码不相同的时候
        if (password !== user.password){
            throw Boom.forbidden("登录失败", "用户不存在或密码错误");
        }

        let userInfo = {
            id: user.id,
            name: user.name
        }

        // 生成 token
        let token = jwt.sign( userInfo, config.jwt.privateKey );
        // 设置响应头，并携带 token到客服端
        ctx.set("authorization", token);

        return userInfo;
    }
}