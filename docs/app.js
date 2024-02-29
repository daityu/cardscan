document.addEventListener("DOMContentLoaded", function () {
    var canvas = new fabric.Canvas('c', { preserveObjectStacking: true });

    // ガイドとなる四角形を描画する
    var guideRect = new fabric.Rect({
        left: 100,
        top: 100,
        fill: 'transparent',
        stroke: 'blue',
        strokeWidth: 5,
        strokeDashArray: [15, 10],
        width: 257,
        height: 162,
        selectable: false, // 選択不可に設定
        hasControls: false,
    });
    canvas.add(guideRect);

    // 写真を操作中に常にガイドの四角形を前面に保つ
    function bringGuideToFront() {
        canvas.bringToFront(guideRect);
    }


    // canvas.on('object:moving', bringGuideToFront);
    // canvas.on('object:scaling', bringGuideToFront);
    // canvas.on('object:rotating', bringGuideToFront);

    // 免許証の写真をアップロードしてCanvasに追加する
    document.getElementById('upload').addEventListener("change", function (e) {
        var file = e.target.files[0];
        var reader = new FileReader();

        reader.onload = function (f) {
            var data = f.target.result;
            fabric.Image.fromURL(data, function (img) {
                // アスペクト比を保ちながら免許証のサイズに合わせる
                var oImg = img.set({ left: 50, top: 50, angle: 0 }).scaleToWidth(300);
                canvas.add(oImg).renderAll();
                bringGuideToFront(); // 初回追加時にも前面に

                // キャンバス上での操作（移動・拡大縮小）を可能にする
                oImg.setControlsVisibility({
                    mt: false, // middle top controlを非表示
                    mb: false, // middle bottom controlを非表示
                    ml: false, // middle left controlを非表示
                    mr: false, // middle right controlを非表示
                });
            });
        };
        reader.readAsDataURL(file);
    });

    // 付箋紙のメモを作成する関数
    function addStickyNote(text) {
        // メモのテキストを作成
        var text = new fabric.IText(text, {
            left: 100,
            top: 100,
            fontFamily: 'arial',
            fill: '#000',
            fontSize: 14,
            backgroundColor: '#ffeb3b' // 付箋紙の色（黄色）
        });

        // メモをキャンバスに追加
        canvas.add(text);

        // メモを選択可能にする
        text.set({
            borderColor: 'red',
            cornerColor: 'green',
            cornerSize: 6,
            transparentCorners: false
        });

        // キャンバスを再描画
        canvas.renderAll();
    }

    // 保存ボタンがクリックされた場合にトリミングを実行する例
    document.getElementById('putmemo').addEventListener("click", function () {
        // テキストエリアからテキストを取得
        var memoElement = document.getElementById('memo');
        var memoText = memoElement.value; // テキストエリアの値を取得
        console.log(memoText); // コンソールにテキストを表示

        // 付箋紙のメモをキャンバスに追加する
        addStickyNote(memoText);
    });


    // 書類画像の上に半透明のマーカー線を追加する関数
    function addTransparentLine() {
        // 線の始点と終点の座標（例えば x1, y1, x2, y2）
        var x1 = 50, y1 = 200, x2 = 200, y2 = 200;

        // 半透明の線を作成
        var line = new fabric.Line([x1, y1, x2, y2], {
            stroke: 'rgba(255,0,0,0.5)', // 赤色で半透明の線
            strokeWidth: 5,             // 線の太さ
            selectable: true            // 選択不可能に設定（必要に応じて変更）
        });

        // 線をキャンバスに追加
        canvas.add(line);

        // キャンバスを再描画
        canvas.renderAll();
    }
    // 保存ボタンがクリックされた場合にトリミングを実行する例
    document.getElementById('putmarker').addEventListener("click", function () {
        // キャンバスが準備できたら、上記の関数を呼び出して線を追加
        addTransparentLine();
    });

    // キーボードイベントのリスナーを追加
    document.addEventListener('keydown', function (e) {
        // 'Delete' キーの keyCode は 46
        if (e.keyCode == 46) {
            // 選択されているオブジェクトを取得
            var activeObject = canvas.getActiveObject();

            // もしオブジェクトが選択されていれば削除
            if (activeObject) {
                canvas.remove(activeObject);

                // キャンバスを再描画
                canvas.renderAll();
            }
        }
    });


});

// キャンバス全体をトリミングして新しいキャンバスに描画する関数
function cropAndPlaceEntireCanvas(sourceCanvas, destinationCanvas) {
    var srcCtx = sourceCanvas.getContext('2d');
    var dstCtx = destinationCanvas.getContext('2d');

    // トリミングする範囲の座標とサイズを指定（ここではキャンバス全体を使用）
    var left = 105;
    var top = 105;
    var width = 252;
    var height = 157;

    // トリミングされた画像データを取得
    var imageData = srcCtx.getImageData(left, top, width, height);

    // 新しいキャンバスのサイズをトリミングした画像に合わせる
    destinationCanvas.width = width;
    destinationCanvas.height = height;

    // 新しいキャンバスに画像データを描画
    dstCtx.putImageData(imageData, 0, 0);
}
// 保存ボタンがクリックされた場合にトリミングを実行する例
document.getElementById('save').addEventListener("click", function () {
    // 元のキャンバス(トリミング元)と新しいキャンバス(トリミング先)を取得
    var sourceCanvas = document.getElementById('c'); // トリミング元のキャンバスのID
    var destinationCanvas = document.getElementById('c2'); // トリミング先のキャンバスのID

    // トリミングと新しいキャンバスへの配置を実行
    cropAndPlaceEntireCanvas(sourceCanvas, destinationCanvas);

});
