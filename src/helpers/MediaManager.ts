import {Media} from "../shared/Message";

export default function MediaManager (m : Media, components : any) {
    const type = m.type.split("/")[0]
    return components[type]
}