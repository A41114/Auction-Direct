const initialState = {};

// const reducer = (state = initialState, action) => {
//     switch (action.type) {
//         // Thêm các case xử lý action ở đây
//         default:
//             return state;
//     }
// };
const reducer = (state = initialState, action = {}) => {
    switch (action.type) {
      default:
        return state;
    }
  };
  
export default reducer;