import { Container} from "inversify";

import {Render} from "./models/Render"

const container = new Container();
container.bind<Render>("Render").to(Render)

export {container}