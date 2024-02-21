import {Media} from "../shared/Message";

export default function (m : Media, sizer : number)  {
    if (sizer && m.props?.height) {
        return sizer / m.props.width * m.props.height
    }
    return undefined
}