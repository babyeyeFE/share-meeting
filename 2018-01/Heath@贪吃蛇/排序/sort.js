class Sort{
    constructor(){

    }
    systemSort(arr){
        arr.sort((a,b)=> a - b);
        return arr;
    }
    bubbleSort(arr){
        for(let i = 1;i<arr.length;i++){
            for(let j=0;j<arr.length;j++){
                if(arr[i]<arr[j]){
                    [arr[i],arr[j]] = [arr[j],arr[i]]
                }
            }
        }
        return arr;
    }
    quickSort(arr){
        if(arr.length<=1){
            return arr;
        }
        let pivotIndex = Math.floor(arr.length*0.5);
        let pivot = arr.splice(pivotIndex,1)[0];
        let left = [];
        let right = [];

        for(let i=0;i<arr.length;i++){
            if(arr[i]<=pivot){
                left.push(arr[i]);
            }else{
                right.push(arr[i]);
            }
        }
        return this.quickSort(left).concat([pivot],this.quickSort(right))
    }
    insertSort(array){ 
        let i , j, key, len = array.length;
        for(let i = 1; i < len; i++){ 
          j = i; 
          key = array[j]; 
          while(--j > -1){ 
            if(array[j] > key){ 
              array[j+1] = array[j]; 
            }else{
              break;
            }
          }
          array[j+1] = key; 
        }
        return array; 
    }
}