package io.github.danpatpang.vasy

import android.os.AsyncTask
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.TextView
import kotlinx.android.synthetic.main.activity_main.*;
import org.json.JSONObject
import java.io.*
import java.net.HttpURLConnection
import java.net.MalformedURLException
import java.net.URL

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        // 방법 1
        var text1 = findViewById(R.id.textView) as TextView;
        // 방법 2
        var btn = httpTest;
        btn.setOnClickListener {
            // ip 확인할 것.
            var data = JSONTask().execute().get();
            text1.setText(data);
        }
    }

    public class JSONTask : AsyncTask<String, String, String>() {
        override fun doInBackground(vararg params: String?): String? {
            try {
                var jsonObject: JSONObject = JSONObject();
                jsonObject.accumulate("user_id", "123");
                jsonObject.accumulate("name", "danpatpang");
                var con: HttpURLConnection;
                var br: BufferedReader;

                try {
                    // url 확인
                    println(params.toString());
                    // ip 추가할 것
                    var url = URL("서버 ip 넣어주세요");
                    con = url.openConnection() as HttpURLConnection;
                    con.requestMethod = "POST";
                    con.setRequestProperty("Content-Type", "application/json");
                    con.setRequestProperty("Accept", "text/html");
                    con.doOutput = true;
                    con.doInput = true;
                    con.connect();

                    val wr: BufferedWriter = BufferedWriter(OutputStreamWriter(con.outputStream));
                    wr.write(jsonObject.toString());
                    wr.flush();
                    wr.close();

                    val br = BufferedReader(InputStreamReader(con.inputStream));
                    // json 파싱 필요
                    return br.readLine();
//                    var line:String ?= null;
//                    val buffer = StringBuffer();
//                    while ({line = br.readLine()} != null) {
//                        buffer.append(line);
//                    }
//
//                    br.close();
//                    return buffer.toString();

                } catch (e: MalformedURLException) {
                    println(e);
                }
            } catch (e: IOException) {
                println(e);
            }
            return "";
        }

        override fun onPreExecute() {
            super.onPreExecute()
        }

        override fun onPostExecute(result: String?) {
            super.onPostExecute(result);
        }
    }
}
