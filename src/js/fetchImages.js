import axios from "axios";
import { page } from "../index";
export const inputEl = document.querySelector('input')
export const limit = 40;
const BASE_URL = 'https://pixabay.com/api/?key='
const API_KEY = '34292431-ace5bd535228626ecae00652c'

export const fetchImages = async () => {
  try {
    const response = await axios.get(`${BASE_URL}${API_KEY}`,{
        params: {
            q: `${inputEl.value}`,
            orientation: 'horizontal',
            image_type: 'photo',
            safesearch: 'true',
            per_page: limit,
            page: page, 
        }
    })
    return response.data; 

  } catch (error) {
    console.log(error);
  }
}







