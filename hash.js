const bcrypt = require('bcrypt');

const users = [
  { userId: '01', password: 'nhanvien001', fullName: 'Nguyễn Văn A', role: 'nhanvien' },
  { userId: '02', password: 'nhanvien002', fullName: 'Trần Văn B', role: 'nhanvienkho' },
  { userId: '03', password: 'nhanvien003', fullName: 'Trần Văn C', role: 'nhanvienmuahang' },
  { userId: '04', password: 'admin123', fullName: 'Trần Văn D', role: 'admin' }
];

(async () => {
  for (const u of users) {
    const hash = await bcrypt.hash(u.password, 10);
    console.log(`('${u.userId}', '${hash}', '${u.fullName}', '${u.role}'),`);
  }
})();