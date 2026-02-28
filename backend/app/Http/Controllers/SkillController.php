<?php
namespace App\Http\Controllers;
use App\Models\Skill;
use Illuminate\Http\Request;

class SkillController extends Controller {
    public function index() { return response()->json(['success' => true, 'data' => Skill::all()]); }
    public function store(Request $request) {
        $v = $request->validate(['name' => 'required|string|unique:skills']);
        $s = Skill::create($v);
        return response()->json(['success' => true, 'data' => $s]);
    }
    public function destroy(Skill $skill) {
        $skill->characters()->detach();
        $skill->delete();
        return response()->json(['success' => true]);
    }
}
