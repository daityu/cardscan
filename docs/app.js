document.addEventListener("DOMContentLoaded", function() {
    var canvas = new fabric.Canvas('c', { preserveObjectStacking: true });

    // ガイドとなる四角形を描画する
    var guideRect = new fabric.Rect({
        left: 100,
        top: 100,
        fill: 'transparent',
        stroke: 'blue',
        strokeWidth: 5,
        strokeDashArray: [15, 10],
        width: 200,
        height: 120,
        selectable: false, // 選択不可に設定
        hasControls: false,
    });
    canvas.add(guideRect);

    // 写真を操作中に常にガイドの四角形を前面に保つ
    function bringGuideToFront() {
        canvas.bringToFront(guideRect);
    }

    canvas.on('object:moving', bringGuideToFront);
    canvas.on('object:scaling', bringGuideToFront);
    canvas.on('object:rotating', bringGuideToFront);

    // 免許証の写真をアップロードしてCanvasに追加する
    document.getElementById('upload').addEventListener("change", function(e) {
        var file = e.target.files[0];
        var reader = new FileReader();

        reader.onload = function(f) {
            var data = f.target.result;
            fabric.Image.fromURL(data, function(img) {
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

                // 写真がガイドに合うように配置されたら、保存用にデータを取得する
                // この部分は実際に保存ボタンなどを用意し、イベントを設定する必要がある
                // var jsonData = canvas.toJSON();
                // console.log(jsonData);
            });
        };
        reader.readAsDataURL(file);
    });
});
