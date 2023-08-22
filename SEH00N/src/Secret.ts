import mysql from 'mysql2';

export const dbConfig:mysql.PoolOptions = {
    user: 'sehoon',
    password: '2006psh0501',
    database: 'sehoon',
    host: 'gondr99.iptime.org',
    port: 3306
};

export const JWT_SECRET = "ㅇㅓㅊㅏㅍㅣㅇㅣㄹㄷㅡㅇㅇㅡㄴㄱㅏㅇㅅㅏㄴ";