import { GetMeal } from "../../SEH00N/src/DB";

async function main() {
    let menus = await GetMeal(new Date(), 0);
    console.log(menus);
}

main();