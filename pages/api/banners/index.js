import { bannerUpload } from "../../../controllers/banners/index";
import axios from "axios";

export const config = {
    api: {
       bodyParser: false,
    },
};

export default async function handler(req, res) {
    switch (req.method) {
        case 'GET':
            // Get Data
            // salesOrderGet(req, res, currentUser.user_id);
            break
        case 'POST':
           
//  const axiosConfig={
//             url: process.env.REACT_APP_DITOKOKU_API_BASE_URL + process.env.REACT_APP_DITOKOKU_API_VERSION_URL + "/banners/upload-image"
//             , method: "POST"
//             , timeout: 40000
//             , responseType: "json"
//             , responseEncoding: "utf8"
//             , headers: {"Content-Type": "multipart/form-data"}
//             , data: request
//         };
// await axios.request(axiosConfig);
            const { data } = await axios.post(process.env.REACT_APP_DITOKOKU_API_BASE_URL + process.env.REACT_APP_DITOKOKU_API_VERSION_URL + "/banners/upload-image", req, {
                responseType: "stream",
                headers: {
                "Content-Type": req.headers["content-type"]
                },
            });
            data.pipe(res);
            break
        case 'PATCH':
            // Edit
            break
        case 'DELETE':
            // Delete
            break
        default:
            res.setHeader('Allow', ['GET', 'POST', 'PATCH', 'DELETE'])
            res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}