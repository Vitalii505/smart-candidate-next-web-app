import React from "react";
import { setCookie } from "nookies";
import styles from "./Auth.module.scss";
import { Button, Form, Input, notification } from "antd";
// import { LoginFormDTO } from "../../api/dto/auth.dto";

import * as Api from "../../api";

export const LoginForm: React.FC = () => {
    const onSubmit = async (values: any) => {
        try {
            const token = await Api.auth.login(values);
            notification.success({
                message: "Авторизовано !",
                description: "Переходим на сторінку профіля... (*user-profile page*)",
                duration: 1,
            });
        
            setCookie(null, "_token", token.toString(), {
                path: "/",
            });
        
            location.href = "/dashboard";
        } catch (err) {   
            notification.error({
                message: "Помидка авторизації  (*auth error*)",
                description: "Невірний пароль або логін",
                duration: 1,
            });
        }
    };

    return (
        <div className={styles.formBlock}>

            <Form
                name="basic"
                labelCol={{
                    span: 8,
                }}
                onFinish={onSubmit}
                >
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: "Вкажіть (*you Email)",
                            }
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: "Вкажіть пароль (*you Password)",
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                    >
                        <Button type="primary" htmlType="submit">Login</Button>
                    </Form.Item>
            </Form>
        </div>
    );
}
