import { Router } from "express";
import {signup, login} from '../Controler/user.controle.js'
import {fetchHistory} from "../Controler/History.js";
import { getUserHistory,addToHistory } from "../Controler/user.controle.js";


let router = Router();

router.route("/login").post(login)
router.route("/signup").post(signup)
router.route("/add_to_activity");
router.route("/gte_all_addactivity").post(getUserHistory)
router.route("/gte_all_addactivity/add").post(addToHistory)
router.route("/history").post(fetchHistory)

export default router;