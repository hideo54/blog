/* eslint-disable @typescript-eslint/no-var-requires */
import admin from 'firebase-admin';

admin.initializeApp();

const files = {
    hatenaStars: './hatenaStars',
};

for (const key of Object.keys(files) as (keyof typeof files)[]) {
    // deploy時: process.env.FUNCTION_NAMEは空なので、定義した関数をdeploy
    // 実行時: process.env.FUNCTION_NAMEには関数名が入っているので、対象関数のファイルのみ実行
    if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === key) {
        module.exports[key] = require(files[key]).default;
    }
}
