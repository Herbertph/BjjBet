const pool = require('./db/config');

(async () => {
    try {
        const res = await pool.query('SELECT NOW()');
        console.log("Conexão bem-sucedida:", res.rows);
        process.exit(0);
    } catch (err) {
        console.error("Erro ao conectar ao banco:", err.message);
        process.exit(1);
    }
})();
