<?php
namespace App\Http\Controllers;
use App\Models\Character;
use App\Models\Attribute;
use Illuminate\Http\Request;

class CharacterController extends Controller {
    public function index() { return response()->json(['success' => true, 'data' => Character::all()]); }
    
    public function store(Request $request) {
        // バリデーション（チェック）を少し緩くする
        $v = $request->validate([
            'name' => 'required|string',
            'attributes' => 'required|array',
            'skills' => 'array' // required を外す（スキルなしでも保存できるように）
        ]);
        
        $c = Character::create(['name' => $v['name']]);
        
        // 属性の保存処理
        if (isset($v['attributes']) && is_array($v['attributes'])) {
            foreach ($v['attributes'] as $a) { 
                Attribute::create([
                    'character_id' => $c->id, 
                    'name' => $a['name'], 
                    // 一旦文字として受け取ってから数字に変換して保存
                    'value' => (int)$a['value'] 
                ]); 
            }
        }
        
        // スキルの保存処理（存在する場合のみ）
        if (isset($v['skills']) && is_array($v['skills']) && !empty($v['skills'])) { 
            $c->skills()->sync($v['skills']); 
        }
        
        return response()->json([
            'success' => true, 
            'data' => $c->load(['attributes', 'skills'])
        ]);
    }


    public function destroy(Character $character) {
        $character->attributes()->delete();
        $character->skills()->detach();
        $character->delete();
        return response()->json(['success' => true]);
    }
}
