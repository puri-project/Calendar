package io.github.danpatpang.vasy

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.widget.Toast
import kotlinx.android.synthetic.main.activity_sub.*;

class SubActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_sub)

        logout.setOnClickListener {
            intent = Intent(this, MainActivity::class.java);
            startActivity(intent);
            var auto = getSharedPreferences("auto", Activity.MODE_PRIVATE);
            var editor = auto.edit();
            editor.clear();
            editor.commit();
            Toast.makeText(this, "logout", Toast.LENGTH_LONG).show();
            finish();
        }
    }
}
