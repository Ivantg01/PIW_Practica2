import {FunctionComponent} from "preact";

type UserProps = {
    name:string,
    email:string,
    sex:string,
    address:string;
}

export const User: FunctionComponent<UserProps> = (props) => {
    const {name, email, sex, address} = props;
    return(
        <div class="userContainer">

            <div className="userHeader">
                <img className="img-s" alt="icon" src={"user.png"}/>
                <p>{name}</p>
                <hr/>
            </div>
            <div className="userBody">
                <p>email: {email}</p>
                <p>Sex: {sex === "F" ? "Female" : "Male"}</p>
                <p>Address: {address}</p>
            </div>
        </div>
    )
}

export default User;