package com.alhidayah.audio;

import android.os.Bundle;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Keep the WebView 100% full-screen edge-to-edge without shrinking or padding the container.
        // Measure system insets and pass them directly to the WebView as CSS custom properties.
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(android.R.id.content), (view, windowInsets) -> {
            Insets insets = windowInsets.getInsets(
                WindowInsetsCompat.Type.systemBars() | WindowInsetsCompat.Type.displayCutout()
            );
            float density = getResources().getDisplayMetrics().density;
            float topDp = insets.top / density;
            float bottomDp = insets.bottom / density;

            if (getBridge() != null && getBridge().getWebView() != null) {
                getBridge().getWebView().post(() -> {
                    getBridge().getWebView().evaluateJavascript(
                        "document.documentElement.style.setProperty('--safe-area-top', '" + topDp + "px');" +
                        "document.documentElement.style.setProperty('--safe-area-bottom', '" + bottomDp + "px');",
                        null
                    );
                });
            }
            return windowInsets;
        });
    }
}
