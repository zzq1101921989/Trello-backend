import databaseConfig from './database.json';
import path from "path"

// 声明一个类型验证
interface IDatabaseConfig {
    username: string,
    password: string,
    database: string,
    host: string,
    dialect: 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql';
    timezone: string
}

const configs = {
    development: {
        server: {
            host: 'localhost',
            port: 8080
        },
        database: databaseConfig.development as IDatabaseConfig,
        jwt: {
            privateKey: "zzq"
        },
        storage: {
            public: path.resolve( __dirname, "../attachments"),
            prefix: '/public/attachments'
        }
    },
    test: {
        server: {
            host: 'localhost',
            port: 8080
        },
        database: databaseConfig.test as IDatabaseConfig,
        jwt: {
            privateKey: "zzq"
        },
        storage: {
            public: path.resolve( __dirname, "../attachments"),
            prefix: '/public/attachments'
        }
    },
    env: {
        server: {
            host: 'localhost',
            port: 8080
        },
        database: databaseConfig.production as IDatabaseConfig,
        jwt: {
            privateKey: "zzq"
        },
        storage: {
            public: path.resolve( __dirname, "../attachments"),
            prefix: '/public/attachments'
        }
    }
}

// 定义变量的取值范围来严格约束一下 因为 NODE_EVN 是一个字符串 范围很广，所以需要精确的约束一下 这是 ts 的书写规范, 
// 但是这种写法过于死板，万一里面的配置文件又增加了，那么还需要手动的去一个个添加，显然是不方便的所以可以用 ts 自带的一些方式来简化
// type configKeys = "dev" | "test" | "env";

// typeof：把对象中的所有类型都给拿出来
// keyof 拿到当前对象类型的第一层 key
type configKeys = keyof typeof configs;

// 在 node 中通过一直值还读取当前运行环境变量,  因为 ts 中没有内置 node 相关的变量说明所以需要 npm i @types/node -D 安装一个说明包
//  process.env.NODE_ENV as configKeys 告诉  process.env.NODE_ENV 取出来的数值是约束在 configKeys之中的
const NODE_EVN = process.env.NODE_ENV as configKeys || 'development'

export default configs[NODE_EVN];