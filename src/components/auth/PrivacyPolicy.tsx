"use client";

export const PrivacyPolicy = () => {
    return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-gray-300">
            <div className="bg-white shadow-xl rounded-lg p-8 space-y-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-2">개인정보 처리 방침</h1>
                    <p className="mb-2">포스트플레이스는 사용자의 개인정보 보호를 위해 다음 방침을 준수합니다.</p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-1">수집하는 개인정보</h2>
                    <p className="mb-2">구글 계정: 회원 기능을 위해 사용됩니다.</p>
                    <p>위치 정보: 서비스 기능을 제공하기 위해 사용되며, 별도로 저장되지 않습니다.</p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-1">개인정보 제3자 제공</h2>
                    <p>법적 의무가 있는 경우를 제외하고 개인정보를 제3자에게 제공하지 않습니다.</p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-1">사용자 권리</h2>
                    <p>사용자는 언제든지 개인정보 조회, 수정, 삭제, 서비스 탈퇴를 요청할 수 있습니다.</p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-1">문의처</h2>
                    <p>dnslfkrh@gmail.com</p>
                </div>

                <p className="text-lg">본 방침은 서비스 시작일인 11월 2일부로 시행됩니다.</p>
            </div>
        </div>
    );
}
