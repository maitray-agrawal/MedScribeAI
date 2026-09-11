#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;

#[tauri::command]
fn check_backend_status() -> Result<String, String> {
    Ok("ok".to_string())
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_process::init())
        .invoke_handler(tauri::generate_handler![check_backend_status])
        .setup(|app| {
            println!("[MedScribeAI] Tauri Desktop Shell Initialized.");
            println!("[MedScribeAI] Sovereign local backend sidecar target: 127.0.0.1:8000.");
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running MedScribeAI tauri desktop application");
}
