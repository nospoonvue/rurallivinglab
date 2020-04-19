<template>
 <div id="login">
    <section id="banner" class="banner">

        <div class="content" v-if="user && user.Token && !signUp">
            <h1>Profile</h1>
            <p><input type="text" disabled name="loggedInName" id="loggedInName" value="" placeholder="Name" autocomplete="off" v-model="user.Username"></p>
            <p><input type="text" name="loggedInName" id="loggedInName" value="" placeholder="First name" autocomplete="off"  v-model="user.Name"></p>
            <p><input type="text" name="loggedInLastName" id="loggedInLastName" value="" placeholder="Last name" v-model="user.LastName"></p>
            <p><input type="email" name="Email" id="emailProfile" value="" placeholder="E-mail" v-model="user.Email"></p>
            <p><input type="url" name="AvatarUrl" id="avatarUrl" value="" placeholder="Url" v-model="user.AvatarUrl"></p>
            <ul class="actions">
                <li><a href="#" class="button primary" v-on:click="updateProfile()">Update</a></li>
                <li><a href="#" class="button" v-on:click="logOut()">Log out</a></li>
                <li><a href="#" class="button" v-on:click="deleteProfile()">Delete profile</a></li>
            </ul>
        </div>

        <div class="content" v-if="!user || !user.Token && !signUp">

                <h1>Login</h1>
                <p><input type="text" name="loginName" id="loginName" value="" placeholder="Username" v-model="user.Username"></p>
                <p><input type="password" name="Password" id="Password" value="" placeholder="Password" v-model="user.Password"></p>
                <ul class="actions">
                    <li><a href="#" class="button primary" v-on:click="getLogin()">Login</a></li>
                    <li><a href="#" class="button" v-on:click="applyForAccount()">Sign up</a></li>
                </ul>
        </div>

        <div class="content" v-if="signUp">

                <h1>Sign up</h1>
                <p><input type="text" name="loginName" id="loginName" value="" placeholder="Username" v-model="user.Username"></p>
                <p><input type="text" name="loggedInName" id="loggedInName" value="" placeholder="First name" v-model="user.Name"></p>
                <p><input type="text" name="loggedInLastName" id="loggedInLastName" value="" placeholder="Last name" v-model="user.LastName"></p>
                
                <p><input type="password" name="Password" id="Password" value="" placeholder="Password" v-model="user.Password"></p>
                <p><input type="email" name="Email" id="email" value="" placeholder="E-mail" v-model="user.Email"></p>
                <ul class="actions">
                    <li><a href="#" class="button primary" v-on:click="getAccount()">Sign up</a></li>
                    <li><a href="#" class="button" v-on:click="signUp=false">Login</a></li>
                </ul>
                
        </div>

        <span class="image object">
            <img v-bind:src="user.AvatarUrl" v-bind:alt="user.Name" />
        </span>
    </section>
 <Status v-bind:class="statuscss" v-bind:img="status"/>
</div>

</template>


<style >

</style>

<script>
import axios from 'axios';
import Status from '@/components/Status.vue'

async function getData(viewStatus,action)
{

    viewStatus.statuscss = "StatusShow";

    const config = 
    {
        headers: 
        {
        }
    }

    const formData = new FormData();
    formData.append('action', action);
    formData.append('data', JSON.stringify(viewStatus.user));

    alert("action:"+action+":userin:"+JSON.stringify(viewStatus.user));

    await axios.post (viewStatus.$baseUrl, formData, config)
            .then(response => 
            {
                //alert(baseUrl);
                alert('response:'+JSON.stringify(response))
                if(action == 'delete')
                {
                    return;
                }
                //multiple record return
                var userFound = false;
                if(action == "login" && response.data.records[0])
                {
                    viewStatus.user = response.data.records[0].fields;
                    userFound = true;
                }

                //single record return
                if((action == "create" || action == "update") && response.data.fields)
                {
                    viewStatus.user = response.data.fields;  
                    userFound = true;
                } 

                viewStatus.statuscss = "StatusHidden";
                //alert('user:'+JSON.stringify(viewStatus.user));
               // alert(viewStatus.data.length)

                if(userFound)
                {
                    //store in browser
                    sessionStorage.user = JSON.stringify(viewStatus.user)
                    localStorage.user = JSON.stringify(viewStatus.user)
                    //update login/profile label
                    document.getElementById('un').innerHTML = viewStatus.user.Name;
                    viewStatus.signUp = false;
                }
                else
                {
                    alert('Login failed');
                    document.getElementById('un').innerHTML = "Login";
                }

            }).catch
            (
                function (error) 
                {
                    console.log(error);
                    alert(error);
                }
            )
}

export default 
{
    name: "login",
    components: {Status},

    data() 
    {
    return {
        data: null,
        statuscss: "StatusHidden",
        status: "",
        signUp: false,
        table: "User",
        user: {}
        }
    },
    methods:
    {
        getLogin: function()
        {
            //alert('getlogin');
    
            getData(this, 'login');
        },
        logOut: function()
        {
            this.clearUser();
            document.getElementById('un').innerHTML = "Log in";
        },
        applyForAccount: function()
        {
            //clearUser();
            this.signUp = true;
        },
        getAccount: function()
        {
            
            getData(this, 'create');
        },
        clearUser: function()
        {
            this.user = {};
            localStorage.clear();
            sessionStorage.clear();

        },
        updateProfile: function()
        {
            getData(this, 'update');
        },
        deleteProfile: function()
        {
            getData(this, 'delete');
            this.clearUser();
        }
    },
    computed: {

  },
  mounted()
  {
     
  },
  
    created() 
    {
     
     	if(localStorage.user)
        {
            this.user = JSON.parse(localStorage.user);

            if(this.user.Name)
            {
                document.getElementById('un').innerHTML = this.user.Name;
            }
        }
  
    }
}


</script>


