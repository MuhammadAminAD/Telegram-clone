class UserServices {
      constructor() {
            this.baseUrl = `https://telegram-clone-rlij.onrender.com`
            this.password = "1ecbAa398"
            // this.password = process.env.REACT_APP_SERVER_PASSWORD
      }

      async request(url, method = "GET", body, authToken) {
            const headers = {
                  "Content-Type": "application/json",
                  "Accept": "application/json",
                  "x-access-password": this.password

            }
            if (authToken) {
                  headers['Authorization'] = `Bearer ${authToken}`
            }

            const options = { method, headers }

            if (body) {
                  options.body = JSON.stringify(body)
            }

            try {
                  const response = await fetch(url, options)
                  return await response.json()
            } catch (error) {
                  console.log(error)
            }
      }

      async sendEmail(email) {
            if (!email || typeof email !== 'string' || !email.includes('@')) {
                  throw new Error("Invalid email address");
            }
            return this.request(`${this.baseUrl}/user`, 'POST', { email });
      }

      async getUserInfo(email, code) {
            return this.request(`${this.baseUrl}/user/code`, 'POST', { email: email, code: code });
      }

      async addNewUser(body) {
            return this.request(`${this.baseUrl}/newuser`, 'POST', body);
      }


      async sendToken(token) {
            return this.request(`${this.baseUrl}/token`, 'GET', null, token);
      }


      async sendChat(body, token) {
            return this.request(`${this.baseUrl}/newchat`, 'POST', body, token);
      }

      async findChat(to, token) {
            return this.request(`${this.baseUrl}/chat/${to}`, 'GET', null, token);
      }

      async checkUsername(username, token) {
            return this.request(`${this.baseUrl}/user/username/${username}`, 'GET', null, token);
      }

      async getUsers(token) {
            return this.request(`${this.baseUrl}/users/friends`, 'GET', null, token);
      }

      async searchUserName(username, token) {
            return this.request(`${this.baseUrl}/users/find/${username}`, 'GET', null, token);
      }


      async searchClicked(userId, token) {
            return this.request(`${this.baseUrl}/users/friends/add/${userId}`, 'GET', null, token);
      }

      async deleteFriend(friendId, token) {
            return this.request(`${this.baseUrl}/users/friends/remove/${friendId}`, 'GET', null, token);
      }

      async deleteMessage(messageId, token) {
            return this.request(`${this.baseUrl}/chat/delete/${messageId}`, 'GET', null, token);
      }

}

const userServices = new UserServices()
export default userServices