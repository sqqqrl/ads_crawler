import { 
    domain_list as domainList,
    search_params as searchParams 
} from '../domains.json'
import { isValidArray, fetchPage } from './utils';

// const process = () => {

// }

const main = async () => {
    const results: any[] = [];

    for (let i = 0; i < domainList.length; i++) {
        try {
            const pageContent = await fetchPage(`https://${domainList[i]}/ads.txt`, {
                method: "GET"
            });

            results.push(pageContent);

        } catch (err) {
            console.error(err);
        }
    }
    
    return results;
}

(async () => {
    if (!isValidArray(domainList) || !isValidArray(searchParams)) {
        throw new Error(`Incorrect structure of domains.json. Check research.md or readme.md`);
    }

    await main();
})();