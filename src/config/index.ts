
export default {
    logDir : process.env.LOG_DIR||'./logs',
    isDev : process.env.NODE_ENV !== 'Development'
};