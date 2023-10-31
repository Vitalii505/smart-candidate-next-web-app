import React from "react";
import { setCookie } from "nookies";
import styles from "./Auth.module.scss";
import { Button, Form, Input, notification } from "antd";
import { RegisterFormDTO } from "../../api/dto/auth.dto";

import * as Api from "../../api";

export const RegisterForm: React.FC = () => {
    const onSubmit = async (values: RegisterFormDTO) => {
        try {
            const { token } = await Api.auth.register(values);

            notification.success({
                message: "Зареєстровано нового Юзера !",
                description: "Переходим на Адмін-сторінку профіля... (*user-profile page*)",
                duration: 2,
            });

            setCookie(null, "_token", token, {
                path: "/",
            });

            location.href = "/dashboard";
        } catch (err) {

            notification.error({
                message: "Помилка реєстрації !",
                description: "Помилка при реєстрації нового Юзера (*register error*) ",
                duration: 2,
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
                        message: "Вкажіть свій Email",
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Name/Nick"
                    name="fullName"
                    rules={[
                        {
                            required: true,
                            message: "Вкажіть анкетні дані",
                        },
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
                            message: "Вкажіть свій пароль",
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
                    <Button type="primary" htmlType="submit">
                        * Register *
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};