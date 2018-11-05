package io.github.danpatpang.vasy

import android.app.Activity
import android.content.Intent
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.widget.Toast
import kotlinx.android.synthetic.main.activity_main.*

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // SharePreferences를 사용
        var auto = getSharedPreferences("auto", Activity.MODE_PRIVATE);
        // 처음에는 아무런 정보도 없으므로 값을 저장할 키를 생성.
        var loginId = auto.getString("inputId", null);
        var loginPassword = auto.getString("inputPassword", null);

        // 가져온 값이 일치할 경우 자동적으로 액티비티 이동( DB 이용해야함 )
        if (loginId != null && loginPassword != null) {
            if (loginId.equals("danpatpang") && loginPassword.equals("123")) {

                Toast.makeText(this, loginId + "auto", Toast.LENGTH_SHORT).show();
                var intent = Intent(this, SubActivity::class.java);
                startActivity(intent);
                finish();
            }
        } else {
            inputButton.setOnClickListener {
                var id = inputId.text.toString();
                var password = inputPassword.text.toString();

                if (id.equals("danpatpang") && password.equals("123")) {
                    Log.d("1", "1");
                    auto = getSharedPreferences("auto", Activity.MODE_PRIVATE);
                    var autoLogin = auto.edit();
                    autoLogin.putString("inputId", id);
                    autoLogin.putString("inputPassword", password);
                    autoLogin.commit();
                    Toast.makeText(this, id + "님 hello", Toast.LENGTH_SHORT).show();
                    var intent = Intent(this, SubActivity::class.java);
                    startActivity(intent);
                    finish();
                } else {
                    Toast.makeText(this, "틀렸엉", Toast.LENGTH_SHORT).show();
                }
            }
        }
    }

}