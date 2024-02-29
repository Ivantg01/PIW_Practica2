import {Handlers, FreshContext, PageProps} from "$fresh/server.ts";
import Axios from "npm:axios";
import User from "../../components/User.tsx";
import { load } from "https://deno.land/std@0.202.0/dotenv/mod.ts";



type User = {
    name:string,
    email:string,
    sex:string,
    address:string;
}



const Page = (props: PageProps<User>) => {
    const name=props.data.name;
    const sex=props.data.sex;
    const email=props.data.email;
    const address=props.data.address;
    return(
        <div className="userMain">
            <div className="userBody">
                <User name={name}
                      email={email}
                      sex={sex}
                      address={address}
                />
                <div className="buttonBack">
                    <a href="/user" >
                        <button className="butSum" type="submit">Reload</button>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default Page;

export const handler: Handlers = {
    GET: async (_req: Request, context: FreshContext<unknown, User>) => {
        const BASE_URL="https://api.api-ninjas.com/v1/randomuser";
        const env = await load();
        const API_KEY = env.API_KEY|| Deno.env.get("API_KEY") /* || "INSERT API_KEY"   */ ;
        console.log(env)
        if (!API_KEY) {
            return new Response("Error - NINJA API KEY NOT FOUND", { status: 500 });
        }
        const response: User = await Axios
            .get<User>(BASE_URL,{
                headers: {
                    'X-Api-Key': API_KEY
                },
            });
        return context.render(response.data);
    },
}

