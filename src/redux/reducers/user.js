import { createSlice } from '@reduxjs/toolkit'

export const user = createSlice({
  name: 'user',
  initialState: {
    value: 0,
    user:null,
    loggedIn:false,
    AuthToken : null,
    ProfileSetupScreen : 'Login',
    userProfile:null
  },
  reducers: {
    loginUser : (state,action) => {
        state.user = action.payload.user;
        state.loggedIn = true;
        state.AuthToken = action.payload.AuthToken;
    },
    setProfileData:(state,action)=>{
      state.userProfile = action.payload.userProfile;
    },
    logoutUser : (state) => {
        state.user = null;
        state.loggedIn = false;
        state.AuthToken = null;
    },
    ProfileSetup : (state) => {
        if(state.user){ 
            if(state.user.username && state.user.first_name && state.user.last_name && state.user.mobile){
                //alias,displayName
                if(state.user.alias && state.user.alias_name){
                    state.ProfileSetupScreen = "Home";
                }else{
                    state.ProfileSetupScreen =  "Alias"
                }
            }else{
                state.ProfileSetupScreen =  "RealId"
            }
        }else{
            state.ProfileSetupScreen =  "Login"
        }

    },
    UpdateUser : (state,action) =>{
      state.user = action.payload.user
    },
  },
})

// Action creators are generated for each case reducer function
export const { loginUser,logoutUser,ProfileSetup,UpdateUser, setProfileData } = user.actions

export default user.reducer