import {FreshContext, Handlers, PageProps} from "https://deno.land/x/fresh@1.6.3/src/server/types.ts";
import Axios from "npm:axios"
import {load} from "https://deno.land/std@0.202.0/dotenv/mod.ts";

type Dog = {
    name:string,
    max_height_male:number,
    max_height_female:number,
    max_weight_male:number,
    max_weight_female:number,
    good_with_strangers:number,
    good_with_children:number,
    good_with_other_dogs:number,
    image_link:string;
}


export const handler: Handlers = {
    GET:  async (req: Request, ctx: FreshContext) => {
        const BASE_URL = "https://api.api-ninjas.com/v1/dogs?name="
        const env = await load();
        const API_KEY = env.API_KEY|| Deno.env.get("API_KEY") /* || "INSERT API_KEY"   */ ;
        if (!API_KEY) {
            return new Response("Error - NINJA API KEY NOT FOUND", { status: 500 });
        }
        const url = new URL(req.url);
        const name = url.searchParams.get("param") || undefined;
        console.log(name)
        const noParams:Dog={
            name:"No",
            max_height_male:0,
            max_height_female:0,
            max_weight_male:0,
            max_weight_female:0,
            good_with_strangers:0,
            good_with_children:0,
            good_with_other_dogs:0,
            image_link:"No"
        };
        const noParamsRes:Dog[]=[noParams];
        if(name===undefined || name==="" || name===" "){
            return ctx.render(noParamsRes)
        }else{
            const response: Dog[] = await Axios
                .get<Dog[]>(BASE_URL+name,{
                    headers: {
                        'X-Api-Key': API_KEY
                    },
                })
            if(response.status!==200 || response.data[0]===undefined){
                return ctx.render(noParamsRes);
            }
            console.log(response)
            return ctx.render(response.data)
        }
    },
};

const Page = (props: PageProps<Dog>) => {
    const dog: Dog[] = props.data;
    if (dog[0].name==="No"){
        return(
            <div className="fetch">
                <h1><font color="black"> Fetch a dog!</font></h1>
                <form action="/dog" method="get">
                    <input className="inputSum" type="text" name="param" placeholder="Search a dog"></input>
                    <button className="butSum" type="submit">Fetch</button>
                </form>
            </div>
        );
    }else{
        return (
            <div>
                <div className="dogContainer">
                    <div className="dogImg">
                        <img src={dog[0].image_link} width="300" height="300"></img>
                    </div>
                    <div>
                        <ul>
                            <li>Name: {dog[0].name}</li>
                            <li>Max height Male: {dog[0].max_height_male}</li>
                            <li>Max height Female: {dog[0].max_height_female}</li>
                            <li>Max weight Male: {dog[0].max_weight_male}</li>
                            <li>Max weight Female: {dog[0].max_weight_female}</li>
                            <li>Good with strangers: {dog[0].good_with_strangers}</li>
                            <li>Good with children: {dog[0].good_with_children}</li>
                            <li>Good with other dogs: {dog[0].good_with_other_dogs}</li>
                        </ul>
                    </div>
                </div>
                <div className="buttonBack">
                    <a href="/dog" >
                        <button align-items="center" className="butSum" type="submit">Back</button>
                    </a>
                </div>
            </div>

        );

    }
};

export default Page;