import {FreshContext, Handlers, PageProps} from "https://deno.land/x/fresh@1.6.3/src/server/types.ts";
import Axios from "npm:axios"
import { load } from "https://deno.land/std@0.204.0/dotenv/mod.ts";

type City = {
    city:string;
    name:string,
    latitude:string,
    longitude:string,
    country:string;
    population:string;
    is_capital:boolean;
}


export const handler: Handlers = {
    GET:  async (req: Request, ctx: FreshContext) => {
        const BASE_URL = "https://api.api-ninjas.com/v1/city?name="
        const env = await load();
        const API_KEY = env.API_KEY|| Deno.env.get("API_KEY") /* || "INSERT API_KEY"   */ ;
        if (!API_KEY) {
            return new Response("Error - NINJA API KEY NOT FOUND", { status: 500 });
        }
        const url = new URL(req.url);
        const name = url.searchParams.get("param") || undefined;
        console.log(name)
        const noParams={
            city:"No city",
            name:"No city",
            latitude:"No city",
            longitude:"No city",
            country:"No city",
            population:"No city",
            is_capital:false
        };
        const noParamsRes:City[]=[noParams];
        if(name===undefined || name==="" || name===" "){
            return ctx.render(noParamsRes)
        }else{
            const response: City[] = await Axios
                .get<City[]>(BASE_URL+name,{
                    headers: {
                        'X-Api-Key': API_KEY
                    },
                })
            if(response.status!==200 || response.data[0]===undefined){
                return ctx.render(noParamsRes);
            }
            console.log(response.data)

            return ctx.render(response.data);

        }
    },
};

const Page = (props: PageProps<City>) => {
    const city: City[] = props.data;
    if (city[0].name==="No city"  ){
        return(
            <div className="fetch">
                <h1><font color="black"> Fetch a city!</font></h1>
                <form action="/city" method="get">
                    <input className="inputSum" type="text" name="param" placeholder="Search a city"></input>
                    <button className="butSum" type="submit">Fetch</button>
                </form>
            </div>
        );
    }else{
            let capital;
            console.log(city[0].is_capital)
            if(city[0].is_capital===true)
                capital="Yes";
            else
                capital="No"

            return (
                <div className="cityMain">
                    <div className="cityHeader">
                        <img className="img-s" alt="icon" src={"city.png"}/>
                        <h1>{city[0].name}<br/></h1>
                        <hr/>
                    </div>
                    <div className="cityBody">
                        <ul>
                            <li>Country: {city[0].country}</li>
                            <li>Population: {city[0].population}</li>
                            <li>Latitude: {city[0].latitude}</li>
                            <li>Longitude: {city[0].longitude}</li>
                            <li>Capital: {capital}</li>
                        </ul>
                    </div>
                    <div className="buttonBack">
                        <a href="/city" >
                            <button align-items="center" className="butSum" type="submit">Back</button>
                        </a>
                    </div>
                </div>
            );

        }
};

export default Page;
