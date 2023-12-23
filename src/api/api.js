import api from "../config/api";
import axios from 'axios';

//authentication
export const login = (payload) => axios.post(api.auth.login, payload);

//panel
