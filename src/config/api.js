const Host = ''; //please import it from env file once created using process.env.hostname;

const api = {
    auth: {
        login: `${Host}/login`,
    },

    panel: {
        admin: {

        },
        sale: {

        },
    },
}

export default api;
