import { Router } from "express"
import { sendCode } from "../controllers/sendcode.controller.js"
import { checkCode } from "../controllers/checkcode.controller.js"
import { checkExistingEmail } from "../middlewares/checkExistingEmail.js"
import { newUser } from "../controllers/newUser.controller.js"
import { check_token } from "../controllers/check_token.js"
import { authMiddleware } from "../middlewares/authUser.js"
import { send_chat } from "../controllers/send_chat.js"
import { find_chat } from "../controllers/find_chat.js"
import { checkUsername } from "../controllers/check_username.js"
import { sendusers } from "../controllers/send_users.js"
import { searchuser } from "../controllers/search_user.js"
import { addfriends } from "../controllers/add_friends.js"
import { delete_message } from "../controllers/delate_message.js"
import { delete_user } from "../controllers/delete_user.js"
import { remove_friend } from "../controllers/remove_friend.js"
// import { editmessage } from "../controllers/edit_message.jsx"

const router = Router()

router.post("/user", sendCode)
router.post("/user/code", checkCode)
router.get("/user/username/:username", checkUsername)
router.post("/newuser", checkExistingEmail, newUser)
router.get("/token", authMiddleware, check_token)
router.post("/newchat", authMiddleware, send_chat)
router.get("/chat/:to", authMiddleware, find_chat)
router.get("/chat/delete/:message", authMiddleware, delete_message) // token and message id
router.get("/users/friends", authMiddleware, sendusers)
router.get("/users/friends/add/:to", authMiddleware, addfriends)
router.get("/users/friends/remove/:to", authMiddleware, remove_friend) // token va ochirilladigon odam idsi
router.get("/users/find/:value", authMiddleware, searchuser)
router.get("/users/delete/:id", authMiddleware, delete_user) //token 
// router.patch("/chat", authMiddleware, editmessage) // token , newchat , message idsi

export default router