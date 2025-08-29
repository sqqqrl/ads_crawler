import { list } from '../domains.json'
import { fetchPage } from './utils';

// const process = () => {

// }

const main = async () => {
    const results: any[] = [];

    for (let i = 0; i < list.length; i++) {
        try {
            const pageContent = await fetchPage(`https://${list[i]}/ads.txt`, {
                method: "GET"
            });

            results.push(pageContent);

        } catch (err) {
            console.error(err);
        }
    }
    
    return results;
}

(async () => await main())();