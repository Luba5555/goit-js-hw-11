import axios from "axios";
console.log(axios.isCancel('something'));

export async function fetchImages(name, page, perPage) {
    const API_KEY = '34930574-20b2b904d715e2378ebba8db6';
    const BASE_URL = `https://pixabay.com/api/`;

    return await axios
        .get(
            `${BASE_URL}?key=${API_KEY}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`
        )
        .then(response => response.data);
}