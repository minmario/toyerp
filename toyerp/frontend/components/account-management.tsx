"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { useEffect } from "react";

/** ---------- 타입 선언 ---------- */
type AccountType = "ASSET" | "LIABILITY" | "EQUITY" | "REVENUE" | "EXPENSE";
type FilterType = "전체" | AccountType;

interface Account {
  id: number;
  code: string;
  name: string;
  type: AccountType;
  details: string;
}

interface NewAccount {
  code: string;
  name: string;
  // 새로 추가할 때는 아직 미선택일 수 있으므로 '' 허용
  type: AccountType | "";
  details: string;
}
/** -------------------------------- */

// 영어 -> 한국어 변환 함수
const getKoreanType = (type: AccountType): string => {
  switch (type) {
    case "ASSET":
      return "자산";
    case "LIABILITY":
      return "부채";
    case "EQUITY":
      return "자본";
    case "REVENUE":
      return "수익";
    case "EXPENSE":
      return "비용";
    default:
      return type;
  }
};

// 한국어 -> 영어 변환 함수 (새로 추가할 때 사용)
const getEnglishType = (koreanType: string): AccountType => {
  switch (koreanType) {
    case "자산":
      return "ASSET";
    case "부채":
      return "LIABILITY";
    case "자본":
      return "EQUITY";
    case "수익":
      return "REVENUE";
    case "비용":
      return "EXPENSE";
    default:
      return koreanType as AccountType;
  }
};

export function AccountManagement() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  
  useEffect(() => {
    fetch("http://localhost:8080/api/accounts")
      .then((res) => res.json())
      .then((data: Account[]) => {
        setAccounts(data);
      })
      .catch((err) => {
        console.error("계정과목 불러오기 실패:", err);
      });
  }, []);

  const [newAccount, setNewAccount] = useState<NewAccount>({
    code: "",
    name: "",
    type: "",
    details: "",
  });

  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("전체");

const handleAddAccount = async () => {
    // 간단한 유효성 체크
    if (!newAccount.code || !newAccount.name || !newAccount.type) {
      alert("계정코드, 계정명, 계정유형을 입력해주세요.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/accounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: parseInt(newAccount.code),
          name: newAccount.name,
          type: newAccount.type,
          details: newAccount.details,
        }),
      });

      if (response.ok) {
        const message = await response.text();
        alert(message);
        
        // 성공적으로 저장되면 목록을 새로고침
        const updatedAccounts = await fetch("http://localhost:8080/api/accounts")
          .then((res) => res.json());
        setAccounts(updatedAccounts);
        
        // 폼 초기화
        setNewAccount({ code: "", name: "", type: "", details: "" });
        setIsDialogOpen(false);
      } else {
        const errorMessage = await response.text();
        alert(`오류: ${errorMessage}`);
      }
    } catch (error) {
      console.error("계정과목 등록 실패:", error);
      alert("서버 연결에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleEditAccount = (account: Account) => {
    setEditingAccount({ ...account });
    setIsEditDialogOpen(true);
  };

const handleUpdateAccount = async () => {
  if (!editingAccount) return;

  // 간단한 유효성 체크
  if (!editingAccount.code || !editingAccount.name || !editingAccount.type) {
    alert("계정코드, 계정명, 계정유형을 입력해주세요.");
    return;
  }

  try {
    const response = await fetch(`http://localhost:8080/api/accounts/update`, {
      method: "POST",  // PUT에서 POST로 변경
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: editingAccount.id,  // id 추가
        code: parseInt(editingAccount.code),
        name: editingAccount.name,
        type: editingAccount.type,
        details: editingAccount.details,
      }),
    });

    if (response.ok) {
      const message = await response.text();
      alert(message);
      
      // 성공적으로 수정되면 목록을 새로고침
      const updatedAccounts = await fetch("http://localhost:8080/api/accounts")
        .then((res) => res.json());
      setAccounts(updatedAccounts);
      
      setEditingAccount(null);
      setIsEditDialogOpen(false);
    } else {
      const errorMessage = await response.text();
      alert(`오류: ${errorMessage}`);
    }
  } catch (error) {
    console.error("계정과목 수정 실패:", error);
    alert("서버 연결에 실패했습니다. 다시 시도해주세요.");
  }
}

  const handleDeleteAccount = async (accountId: number) => {
    if (confirm("정말로 이 계정과목을 삭제하시겠습니까?\n삭제된 계정과목은 복구할 수 없습니다.")) {
      try {
        const response = await fetch("http://localhost:8080/api/accounts/delete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: accountId,
          }),
        });

        if (response.ok) {
          const message = await response.text();
          alert(message);
          
          // 성공적으로 삭제되면 목록을 새로고침
          const updatedAccounts = await fetch("http://localhost:8080/api/accounts")
            .then((res) => res.json());
          setAccounts(updatedAccounts);
        } else {
          const errorMessage = await response.text();
          alert(`오류: ${errorMessage}`);
        }
      } catch (error) {
        console.error("계정과목 삭제 실패:", error);
        alert("서버 연결에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  const filteredAccounts: Account[] = accounts.filter((account) => {
    const koreanType = getKoreanType(account.type);
    const matchesSearch =
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.code.toString().includes(searchTerm) ||
      account.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      koreanType.toLowerCase().includes(searchTerm.toLowerCase()); // 한국어 유형으로도 검색 가능

    const matchesType = filterType === "전체" || account.type === filterType;
    return matchesSearch && matchesType;
  });

  const getTypeColor = (type: AccountType) => {
    switch (type) {
      case "ASSET":
        return "bg-blue-100 text-blue-800";
      case "LIABILITY":
        return "bg-red-100 text-red-800";
      case "EQUITY":
        return "bg-green-100 text-green-800";
      case "REVENUE":
        return "bg-purple-100 text-purple-800";
      case "EXPENSE":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">계정과목 관리</h1>
          <p className="text-gray-600 mt-2">회계 처리를 위한 계정과목을 관리하세요</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              계정과목 등록
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>새 계정과목 등록</DialogTitle>
              <DialogDescription>새로운 계정과목을 등록하세요</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="id">계정코드</Label>
                <Input
                  id="id"
                  value={newAccount.code}
                  onChange={(e) => setNewAccount({ ...newAccount, code: e.target.value })}
                  placeholder="1500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">계정명</Label>
                <Input
                  id="name"
                  value={newAccount.name}
                  onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                  placeholder="유형자산"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">계정유형</Label>
                <Select
                  value={newAccount.type ? getKoreanType(newAccount.type as AccountType) : ""}
                  onValueChange={(value) =>
                    setNewAccount({ ...newAccount, type: getEnglishType(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="유형 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="자산">자산</SelectItem>
                    <SelectItem value="부채">부채</SelectItem>
                    <SelectItem value="자본">자본</SelectItem>
                    <SelectItem value="수익">수익</SelectItem>
                    <SelectItem value="비용">비용</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">설명</Label>
                <Input
                  id="description"
                  value={newAccount.details}
                  onChange={(e) => setNewAccount({ ...newAccount, details: e.target.value })}
                  placeholder="계정과목에 대한 설명"
                />
              </div>
              <Button onClick={handleAddAccount} className="w-full">
                등록하기
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>계정과목 수정</DialogTitle>
              <DialogDescription>계정과목 정보를 수정하세요</DialogDescription>
            </DialogHeader>
            {editingAccount && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-code">계정코드</Label>
                  <Input
                    id="edit-code"
                    value={editingAccount.code}
                    onChange={(e) =>
                      setEditingAccount({ ...editingAccount, code: e.target.value })
                    }
                    placeholder="1500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-name">계정명</Label>
                  <Input
                    id="edit-name"
                    value={editingAccount.name}
                    onChange={(e) =>
                      setEditingAccount({ ...editingAccount, name: e.target.value })
                    }
                    placeholder="유형자산"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-type">계정유형</Label>
                  <Select
                    value={getKoreanType(editingAccount.type)}
                    onValueChange={(value) =>
                      setEditingAccount({ ...editingAccount, type: getEnglishType(value) })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="유형 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="자산">자산</SelectItem>
                      <SelectItem value="부채">부채</SelectItem>
                      <SelectItem value="자본">자본</SelectItem>
                      <SelectItem value="수익">수익</SelectItem>
                      <SelectItem value="비용">비용</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-description">설명</Label>
                  <Input
                    id="edit-description"
                    value={editingAccount.details}
                    onChange={(e) =>
                      setEditingAccount({ ...editingAccount, details: e.target.value })
                    }
                    placeholder="계정과목에 대한 설명"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleUpdateAccount} className="flex-1">
                    수정하기
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditDialogOpen(false)}
                    className="flex-1 bg-transparent"
                  >
                    취소
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>계정과목 목록</CardTitle>
          <CardDescription>등록된 계정과목을 확인하고 관리하세요</CardDescription>
          <div className="flex gap-4 mt-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="계정명, 코드, 유형으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={(v) => setFilterType(v as FilterType)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="전체">전체</SelectItem>
                <SelectItem value="ASSET">자산</SelectItem>
                <SelectItem value="LIABILITY">부채</SelectItem>
                <SelectItem value="EQUITY">자본</SelectItem>
                <SelectItem value="REVENUE">수익</SelectItem>
                <SelectItem value="EXPENSE">비용</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>계정코드</TableHead>
                <TableHead>계정명</TableHead>
                <TableHead>유형</TableHead>
                <TableHead>설명</TableHead>
                <TableHead>작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAccounts.map((account: Account) => (
                <TableRow key={account.id}>
                  <TableCell className="font-medium">{account.code}</TableCell>
                  <TableCell>{account.name}</TableCell>
                  <TableCell>
                    <Badge className={getTypeColor(account.type)}>
                      {getKoreanType(account.type)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600">{account.details}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEditAccount(account)} title="수정">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteAccount(account.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        title="삭제"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}