import { list } from '../domains.json'
import { fetchPage } from './utils';

const main = async () => {
    for (let i = 0; i < list.length; i++) {
        try {
            const pageContent = await fetchPage(`https://${list[i]}/ads.txt`, {
                method: "GET"
            });

            return pageContent;

        } catch (err) {
            console.error(err);
        }
    }
    console.log(list);
}

(async () => await main())();