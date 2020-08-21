/**
 * 验证类 统一管理 用户相关的
 */

import { 
    Length,
    IsNotEmpty
} from "class-validator"
// 自定义装饰器
import { IsSameValue } from "./VerifyPasswordIsSome"

// 通用 User 验证类
class VerifyUser{
    @Length(1, 50, {
        message: "用户名最小不能小于1个字符，最大不能超过50个字符"
    })
    name: string;

    @IsNotEmpty({
        message: "密码不能为空"
    })
    password: string;
}

// 注册验证类
export class VerifyUserRegister extends VerifyUser{
    @IsSameValue("password", {
        message: "两次密码输入不一致"
    })
    rePassWord: string
}

// 登录验证类
export class VerifyUserLogin extends VerifyUser{
}