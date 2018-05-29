var board = new Array(100);//それぞれの盤面の情報を入れる配列。
var direc = [-10,10,-1,1];//各マスでの進む方向を入れる(上,下,左,右).
var direcstr = ['上','下','左','右'];//各マスにすすめるかどうか
var nowroute = new Array();//現在進めているルートの道のりを収納。
var bestroute = new Array();//今までの最適ルートの道のりを格納する。

var mutateBoard;//突然変異するマスが最初から数えて何番目か
var newRouteC = 0;//変異中に新ルートを進んだ数。
var mutationc = 0;//試行回数
var ismutate = false;//変異中の移動かどうか

var tmp = false;

var pos = 11;//現在調べている位置
board[11] = 1;

var direcboard = function(){//進める方向を調べる
    var retarray=[];//進める方向を日本語で収納する(順序は上下左右)。
    for(var i=0;i<4;i++){
        if(ismutate == false){
            if(board[pos+direc[i]] == 0){
                retarray.push(direcstr[i]);
            }
        }else{
            if((board[pos+direc[i]] == 0)|| (board[pos+direc[i]] == 2)){
                if(pos+direc[i] != 88){
                     retarray.push(direcstr[i]);
                }
            }
        }
    }
    move(retarray);//向きを知ったら動かす。
}

function move(retarray){//実際に動かす。
    if(retarray.length == 0){//進めなくなったらリセット
        if(ismutate){
            mutation();
        }else{
            resetBoard('s');
            pos = 11;
            nowroute = [11];
         }
    }else{
        var rand = Math.floor(Math.random()*(retarray.length));//進める範囲で乱数生成
        switch (retarray[rand]){//実際にposを進める
        case '上':
            insertArray(pos,'↑');//盤上に矢印を加える
            pos = pos -10;//現在位置を変更
            if(board[pos] == 2){
                mutateCheck();
                break;
             }else{
                board[pos] = 1;//盤を調査済にする
                idtoBoard('s');//盤情報を反映
                if(pos == 88){firmRoute();}//ゴールしてたらルート判定する。
                if(pos == 11){resetBoard('s');}//スタートに戻っていたらリセット。
                nowroute.push(pos);//ルート探索が終わらなければ経路を追加していく
                break;
            }
        case '下':
            insertArray(pos,'↓');
            pos = pos +10;
            if(board[pos] == 2){
                mutateCheck();
                break;
            }else{
                board[pos] = 1;
                idtoBoard('s');
                if(pos == 88){firmRoute();}
                if(pos == 11){resetBoard('s');}
                nowroute.push(pos);
                break;
            }
        case '左':
            insertArray(pos,'←');
            pos = pos -1;
            if(board[pos] == 2){
                mutateCheck();
                break;
            }else{
                board[pos] = 1;
                idtoBoard('s');
                if(pos == 88){firmRoute();}
                if(pos == 11){resetBoard('s');}
                nowroute.push(pos);
                break;
            }
        case '右':

            insertArray(pos,'→');    
            pos = pos +1;
            if(board[pos] == 2){
                mutateCheck();
                break;
            }else{
                board[pos] = 1;
                idtoBoard('s');
                if(pos == 88){firmRoute();}
                if(pos == 11){resetBoard('s');}
                nowroute.push(pos);
                break;
            }
        }
    } 
}

function mutateCheck(){//開拓したルートが今までのよりも長いか判定
    newRouteC+=2;
    nowroute.push(pos);
    for(var i=0;i<bestroute.length;i++){
        if(pos == bestroute[i]){var oldto = i;}//到達点が最初から何番目に進んだマスか
    }
    for(var i=0;i<board.length;i++){
        if(board[i]==1){newRouteC++;}//候補になっているルートのマス数を取得
    }
    if(((oldto-mutateBoard)>0) &&((oldto-mutateBoard)<=newRouteC)){//開拓したルートが今までの以上だった
        mutateCopy(oldto);
    }else{
        newRouteC =0;
        oldto = 0;
        resetBoard('s');
        mutation();
    }

}

function mutateCopy(oldto){
    var tmpbestpre = bestroute.slice(0,mutateBoard);//切り抜く直前までのルート
    var tmpbestpost = bestroute.slice(oldto+1);//切り抜く直後のルート
    var tmproute = bestroute.slice(mutateBoard,oldto-mutateBoard+1);//抜き取られるルート
    var tmpnowroute = nowroute;//追加されるルート
    for(var i=0;i<tmproute.length;i++){
        board[tmproute[i]] = 0;
    }
    idtoBoard('a');
    idtoBoard('s');
    nowroute = tmpbestpre;//ルートを更新する。
    for(var i=0;i<tmpnowroute.length;i++){
        nowroute.push(tmpnowroute[i]);//新しいルートを追加
    }
    for(var i=0;i<tmpbestpost.length;i++){
        nowroute.push(tmpbestpost[i]);//変わらないルートを追加
    }
    firmRoute();//これが最長であることを改めてチェック
    resetBoard('s');//盤面をいったん綺麗にする
    mutation();//ふたたび変異を起こさせ、続けていく
    
}

function start(){//開始プログラム
                console.time('timer1');
                while(tmp == false){//まずはゴールまで行くルートを一つ作る。
                    direcboard();
                }
                mutation();//以下ずっと変異させる
            }

function mutation(){//突然変異
    mutationc++;
    document.getElementById('mutate').innerHTML='試行回数:'+mutationc;//試行回数を表示
    document.getElementById('percent').innerHTML='合致％:'+(bestroute.length/63);//合致度を表示
    for(var i=0;i<bestroute.length;i++){
        board[bestroute[i]] = 2;
        idtoBoard('s');
    }

    mutateBoard = Math.floor(Math.random()*(bestroute.length-1));//ルート中のどれかが変異する
    var retarray=[];//進める方向を日本語で収納する(順序は上下左右)。
    pos = bestroute[mutateBoard]; 
    if(pos==88){ pos = bestroute[mutateBoard-1]; }
    nowroute = [pos];
    ismutate = true;

    setInterval(function(){
         direcboard();
    },1);
}

function insertArray(pos,direction){//進んだ向きをマスに記入する
  document.getElementById('s'+pos).innerHTML=''+direction;
}

function resetBoard(b){//盤面をリセット
    for(var i=0;i<board.length;i++){
        if(i<11 || i>88 || i%10==0 || i%10==9){
            board[i] = 3;//外枠
        }else{
            board[i] = 0;
            document.getElementById(b+i).innerHTML='';
        }
        
       }
       pos =11;
       nowroute = [];
       ismutate = false;
       idtoBoard(b);
}

function idtoBoard(b){//board情報をhtmlに反映。
    for(var i=0;i<board.length;i++){
        if(i>10&&i<89&&i%10!=0&&i%10!=9){
            switch (board[i]){
            case 0://何もない
                document.getElementById(b+i).className = "square none";
                break;
            case 1://探索候補
                document.getElementById(b+i).className = "square kouho";
                break;
            case 2://確定
                document.getElementById(b+i).className = "square firm";
            }         
        }
    }
}

function firmRoute(){//導出した道のりが一番長いか検証
    for(var i=0;i<nowroute.length;i++){
        if(nowroute.length>bestroute.length){
            var copya = true;//盤の内容を↓に反映するか
            board[nowroute[i]] = 2;
            bestroute[i] = nowroute[i];         
            idtoBoard('a');
        }
    }
    if(copya == true){//下盤に反映させる
        resetBoard('a');
        for(var i=0;i<bestroute.length;i++){
                document.getElementById('a'+bestroute[i]).className='square firm';
                if(i<bestroute.length-1){
                    var shiki = bestroute[i+1]-bestroute[i]//移動前後のマスIDから移動方向を推定(下盤)
                    if( shiki ==1){
                        document.getElementById('a'+bestroute[i]).innerHTML='→';
                    }else if(shiki==-1){
                        document.getElementById('a'+bestroute[i]).innerHTML='←';
                    }else if(shiki==10){
                        document.getElementById('a'+bestroute[i]).innerHTML='↓';
                    }else if(shiki==-10){
                        document.getElementById('a'+bestroute[i]).innerHTML='↑';
                    }
                }              
        }
        copya = false;
    }
    tmp = true;
    if((bestroute.length/63)>0.80){
        console.timeEnd('timer1');
        console.log(mutationc);
    }
}